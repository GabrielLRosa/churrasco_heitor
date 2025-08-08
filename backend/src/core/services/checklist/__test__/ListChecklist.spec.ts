import { ChecklistRepository } from '@core/entities/checklist/Checklist';
import { ListChecklists } from '../ListChecklist';
import { createMockChecklistsList } from '@test-utils/mocks';

describe('ListChecklists Service', () => {
  let repo: jest.Mocked<ChecklistRepository>;
  let service: ListChecklists;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      getAll: jest.fn(),
    } as unknown as jest.Mocked<ChecklistRepository>;
    service = new ListChecklists(repo);
  });

  it('should return list of checklists', async () => {
    const mockData = createMockChecklistsList();
    (repo.getAll as jest.Mock).mockResolvedValue({ data: mockData, totalCount: 2, pagination: { page: 1, totalPages: 1 } });

    const result = await service.execute({}, [], 10, 0);

    expect(repo.getAll).toHaveBeenCalledWith({ where: {}, order: [], limit: 10, offset: 0 });
    expect(result.data).toEqual(mockData);
    expect(result.totalCount).toBe(2);
  });

  it('should handle errors from repository', async () => {
    const error = new Error('query failed');
    (repo.getAll as jest.Mock).mockRejectedValue(error);

    await expect(service.execute({}, [], 10, 0)).rejects.toThrow('query failed');
  });

  it('should work with filters and ordering', async () => {
    const mockData = createMockChecklistsList();
    const where = { tank_full: true } as any;
    const order = [['created_at', 'DESC']] as Array<[string, string]>;
    
    (repo.getAll as jest.Mock).mockResolvedValue({ data: mockData, totalCount: 1, pagination: { page: 1, totalPages: 1 } });

    const result = await service.execute(where, order, 5, 10);

    expect(repo.getAll).toHaveBeenCalledWith({ where, order, limit: 5, offset: 10 });
    expect(result.data).toEqual(mockData);
  });
}); 