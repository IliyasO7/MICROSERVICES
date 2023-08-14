import { Router } from 'express';
import * as controller from '../controllers/lead.js';
import * as validation from '../validation/leads.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();

router.route('/').get(controller.getLeads);

router.route('/order/:id').post(validate(validation.leadToOrder), controller.createLeadtoOrder);

router
  .route('/:id')
  .get(controller.getLeadById)
  .patch(controller.updateLead)
  .delete(controller.deleteLead);

export default router;
