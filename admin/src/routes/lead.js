import { Router } from 'express';
import * as controller from '../controllers/lead.js';

const router = Router();

router.route('/').get(controller.getLeads);

router
  .route('/:id')
  .get(controller.getLeadById)
  .patch(controller.updateLead)
  .delete(controller.deleteLead);

export default router;
