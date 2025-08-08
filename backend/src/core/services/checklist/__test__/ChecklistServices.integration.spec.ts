import { Sequelize, DataTypes } from 'sequelize';
import { ChecklistModel } from '@adapters/repositories/checklist/ChecklistModel';
import { SequelizeChecklistRepository } from '@adapters/repositories/checklist/ChecklistRepository';
import { CreateChecklist } from '../CreateChecklist';
import { ListChecklists } from '../ListChecklist';

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

describe('Checklist Services Integration', () => {
  let testDb: Sequelize;
  let repo: SequelizeChecklistRepository;
  let createService: CreateChecklist;
  let listService: ListChecklists;

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
    createService = new CreateChecklist(repo);
    listService = new ListChecklists(repo);
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await testDb.sync({ force: true });
  });

  describe('CreateChecklist integration', () => {
    it('should create checklist end to end', async () => {
      const data = { tank_full: true, has_step: false, has_license: true };
      
      const result = await createService.execute(data);

      expect(result.id).toBeDefined();
      expect(result.tank_full).toBe(true);
      expect(result.has_step).toBe(false);
      expect(result.has_license).toBe(true);
    });

    it('should persist data in database correctly', async () => {
      const data = { tank_full: false, has_step: true, has_license: false };
      
      const created = await createService.execute(data);
      const found = await ChecklistModel.findByPk(created.id);

      expect(found).toBeTruthy();
      expect(found?.toJSON()).toMatchObject(data);
    });
  });

  describe('ListChecklists integration', () => {
    it('should return empty list when database is empty', async () => {
      const result = await listService.execute({}, [], 10, 0);

      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should list all created checklists', async () => {
      await createService.execute({ tank_full: true, has_step: false, has_license: true });
      await createService.execute({ tank_full: false, has_step: true, has_license: false });

      const result = await listService.execute({}, [], 10, 0);

      expect(result.data).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should filter checklists properly', async () => {
      await createService.execute({ tank_full: true, has_step: false, has_license: true });
      await createService.execute({ tank_full: false, has_step: true, has_license: false });

      const result = await listService.execute({ tank_full: true } as any, [], 10, 0);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].tank_full).toBe(true);
    });
  });

  describe('services working together', () => {
    it('should create and list work in sequence', async () => {
      const data1 = { tank_full: true, has_step: false, has_license: true };
      const data2 = { tank_full: false, has_step: true, has_license: false };

      await createService.execute(data1);
      await createService.execute(data2);

      const listResult = await listService.execute({}, [['created_at', 'DESC']], 10, 0);

      expect(listResult.data).toHaveLength(2);
      expect(listResult.totalCount).toBe(2);
    });
  });
}); 