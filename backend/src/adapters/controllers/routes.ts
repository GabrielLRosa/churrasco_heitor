import { Router } from 'express';
import checklistRoutes from './checklist/ChecklistController';

const router = Router();

router.use('/checklists', checklistRoutes);

export default router;