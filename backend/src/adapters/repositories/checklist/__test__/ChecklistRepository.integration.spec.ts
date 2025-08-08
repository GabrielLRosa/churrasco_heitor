import { Sequelize, DataTypes } from 'sequelize';
import { SequelizeChecklistRepository } from '../ChecklistRepository';
import { ChecklistModel } from '../ChecklistModel';
import { ChecklistAttributes } from '@core/entities/checklist/Checklist';

jest.mock('@config/redis', () => ({
  getRedisClient: () => null
}));

jest.mock('@infra/cache/CacheService', () => ({
  cache: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  }
}));

describe('ChecklistRepository Integration', () => {
  let testDb: Sequelize;
  let repo: SequelizeChecklistRepository;

  beforeAll(async () => {
    testDb = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    ChecklistModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        tank_full: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        has_step: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        has_license: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          field: 'created_at',
          defaultValue: DataTypes.NOW,
        }
      },
      {
        sequelize: testDb,
        tableName: 'checklists',
        timestamps: false,
      }
    );

    await testDb.sync({ force: true });
    repo = new SequelizeChecklistRepository();
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await testDb.sync({ force: true });
  });

  describe('create', () => {
    it('should create checklist in database', async () => {
      const data = { tank_full: true, has_step: false, has_license: true };
      
      const result = await repo.create(data as any);

      expect(result.id).toBeDefined();
      expect(result.tank_full).toBe(true);
      expect(result.has_step).toBe(false);
      expect(result.has_license).toBe(true);
      expect(result.created_at).toBeDefined();
    });

    it('should create multiple checklists with different values', async () => {
      const data1 = { tank_full: true, has_step: true, has_license: false };
      const data2 = { tank_full: false, has_step: false, has_license: true };

      const result1 = await repo.create(data1 as any);
      const result2 = await repo.create(data2 as any);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.tank_full).toBe(true);
      expect(result2.tank_full).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return empty list when no data', async () => {
      const result = await repo.getAll({ where: {}, order: [], limit: 10, offset: 0 } as any);

      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should return all checklists correctly', async () => {
      await repo.create({ tank_full: true, has_step: false, has_license: true } as any);
      await repo.create({ tank_full: false, has_step: true, has_license: false } as any);

      const result = await repo.getAll({ where: {}, order: [], limit: 10, offset: 0 } as any);

      expect(result.data).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      (result.data as ChecklistAttributes[]).forEach((checklist: ChecklistAttributes) => {
        expect(checklist.id).toBeDefined();
        expect(typeof checklist.tank_full).toBe('boolean');
        expect(typeof checklist.has_step).toBe('boolean');
        expect(typeof checklist.has_license).toBe('boolean');
      });
    });

    it('should filter data correctly', async () => {
      await repo.create({ tank_full: true, has_step: false, has_license: true } as any);
      await repo.create({ tank_full: false, has_step: true, has_license: false } as any);

      const result = await repo.getAll({ where: { tank_full: true } as any, order: [], limit: 10, offset: 0 } as any);

      expect(result.data).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      (result.data as ChecklistAttributes[]).forEach((checklist: ChecklistAttributes) => {
        expect(checklist.tank_full).toBe(true);
      });
    });

    it('should handle pagination properly', async () => {
      await repo.create({ tank_full: true, has_step: false, has_license: true } as any);
      await repo.create({ tank_full: false, has_step: true, has_license: false } as any);
      await repo.create({ tank_full: true, has_step: true, has_license: true } as any);

      const result = await repo.getAll({ where: {}, order: [], limit: 2, offset: 1 } as any);

      expect(result.data).toHaveLength(2);
      expect(result.totalCount).toBe(3);
    });

    it('should sort by created_at correctly', async () => {
      const first = await repo.create({ tank_full: true, has_step: false, has_license: true } as any);
      await new Promise(resolve => setTimeout(resolve, 10));
      const second = await repo.create({ tank_full: false, has_step: true, has_license: false } as any);

      const descResult = await repo.getAll({ where: {}, order: [['created_at', 'DESC']], limit: 10, offset: 0 } as any);
      const ascResult = await repo.getAll({ where: {}, order: [['created_at', 'ASC']], limit: 10, offset: 0 } as any);

      const descDates = (descResult.data as ChecklistAttributes[]).map((c: ChecklistAttributes) => new Date(c.created_at).getTime());
      const ascDates = (ascResult.data as ChecklistAttributes[]).map((c: ChecklistAttributes) => new Date(c.created_at).getTime());

      expect(descDates[0]).toBeGreaterThan(descDates[1]);
      expect(ascDates[0]).toBeLessThan(ascDates[1]);
    });
  });
}); 