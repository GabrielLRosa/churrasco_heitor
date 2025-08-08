import { SequelizeChecklistRepository } from '../ChecklistRepository';
import { ChecklistModel } from '../ChecklistModel';
import { createMockChecklistData, createMockChecklistAttributes, createMockChecklistsList } from '@test-utils/mocks';

jest.mock('../ChecklistModel');
jest.mock('@infra/cache/CacheService', () => ({
  cache: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  }
}));

describe('ChecklistRepository', () => {
  let repo: SequelizeChecklistRepository;
  let mockModel: jest.Mocked<typeof ChecklistModel>;

  beforeEach(() => {
    mockModel = ChecklistModel as jest.Mocked<typeof ChecklistModel>;
    repo = new SequelizeChecklistRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create checklist sucessfully', async () => {
      const data = createMockChecklistData();
      const created = createMockChecklistAttributes();
      const mockInstance = { toJSON: jest.fn().mockReturnValue(created) };

      mockModel.create.mockResolvedValue(mockInstance as any);

      const result = await repo.create(data as any);

      expect(mockModel.create).toHaveBeenCalledWith(data);
      expect(mockInstance.toJSON).toHaveBeenCalled();
      expect(result).toEqual(created);
    });

    it('should throw error when create fails', async () => {
      const data = createMockChecklistData();
      const error = new Error('DB error');

      mockModel.create.mockRejectedValue(error);

      await expect(repo.create(data as any)).rejects.toThrow('DB error');
    });
  });

  describe('getAll', () => {
    it('should return checklists list correctly', async () => {
      const mockData = createMockChecklistsList();
      const mockInstances = mockData.map(item => ({ toJSON: () => item }));

      mockModel.findAndCountAll.mockResolvedValue({
        rows: mockInstances,
        count: mockData.length,
      } as any);

      const result = await repo.getAll({ where: {}, order: [], limit: 10, offset: 0 } as any);

      expect(mockModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [],
        limit: 10,
        offset: 0,
      });
      expect(result.data).toEqual(mockData);
      expect(result.totalCount).toBe(mockData.length);
    });

    it('should handle empty results', async () => {
      mockModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      } as any);

      const result = await repo.getAll({ where: {}, order: [], limit: 10, offset: 0 } as any);

      expect(result.data).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should throw error when list query fails', async () => {
      const error = new Error('Query failed');
      mockModel.findAndCountAll.mockRejectedValue(error);

      await expect(repo.getAll({ where: {}, order: [], limit: 10, offset: 0 } as any)).rejects.toThrow('Query failed');
    });
  });
}); 