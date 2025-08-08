import { Router, Request } from 'express';
import { CreateChecklist } from '@core/services/checklist/CreateChecklist';
import { ListChecklists } from '@core/services/checklist/ListChecklist';
import { SequelizeChecklistRepository } from '@adapters/repositories/checklist/ChecklistRepository';
import { ChecklistQuery } from '@typings/checklist'; 
import { ChecklistAttributes } from '@core/entities/checklist/Checklist'; 
import { validateChecklistBody } from './utils/validateChecklistBody';
import { parseListQueryParams } from './utils/parseListQueryParams'; 

const router = Router();
const checklistRepo = new SequelizeChecklistRepository();
const createChecklistService = new CreateChecklist(checklistRepo);
const listChecklistsService = new ListChecklists(checklistRepo);

router.post('/create', async (req, res) => {
  const { tank_full, has_step, has_license } = validateChecklistBody(req.body);
  
  const newChecklist: ChecklistAttributes = await createChecklistService.execute({ tank_full, has_step, has_license });
  return res.status(201).json(newChecklist);
});

router.get('/', async (req: Request<{}, {}, {}, ChecklistQuery>, res) => {
  const { limit, where, order, offset } = parseListQueryParams(req.query);

  const result = await listChecklistsService.execute(where, order, limit, offset);
  return res.status(200).json(result);
});

export default router;