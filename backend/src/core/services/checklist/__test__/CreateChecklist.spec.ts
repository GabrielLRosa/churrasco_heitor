import { ChecklistRepository } from '@core/entities/checklist/Checklist';
import { CreateChecklist } from '../CreateChecklist';
import { createMockChecklistData, createMockChecklistAttributes } from '@test-utils/mocks';

describe('CreateChecklist Service', () => {
  let repo: jest.Mocked<ChecklistRepository>;
  let service: CreateChecklist;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      getAll: jest.fn(),
    } as unknown as jest.Mocked<ChecklistRepository>;
    service = new CreateChecklist(repo);
  });

  it('should create checklist succesfully', async () => {
    const data = createMockChecklistData();
    const created = createMockChecklistAttributes();

    (repo.create as jest.Mock).mockResolvedValue(created);
    const result = await service.execute(data);

    expect(repo.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(created);
  });

  it('should handle errors when creation fails', async () => {
    const data = createMockChecklistData();
    const error = new Error('DB error');

    (repo.create as jest.Mock).mockRejectedValue(error);

    await expect(service.execute(data)).rejects.toThrow('DB error');
  });
}); 