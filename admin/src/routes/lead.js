import { Router } from 'express';
import * as controller from '../controllers/lead.js';
import * as validation from '../validation/lead.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();

router.route('/').get(controller.getLeads);

router
  .route('/:id')
  .get(controller.getLeadById)
  .patch(controller.updateLead)
  .delete(controller.deleteLead);

router.post(
  '/:id/create-order',
  validate(validation.createLeadOrder),
  controller.createLeadOrder
);

export default router;
