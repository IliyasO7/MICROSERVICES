import * as controller from '../../controllers/rental/tenant.js';
import Router from 'express';
import * as validation from '../../validation/rental/tenant.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getTenants)
  .post(validate(validation.createTenant), controller.createTenant);

router.route('/:id').get(controller.getTenantById);

router.get('/:id/contracts', controller.getTenantContracts);

export default router;
