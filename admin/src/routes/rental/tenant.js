import * as controller from '../../controllers/rental/tenant.js';
import Router from 'express';
import validation from '../../validation/admin.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

//create,update and get tenant
router
  .route('/')
  .get(controller.getTenants) //done
  .post(validate(validation.saveUserTenant), controller.createTenant); //done
//.patch(validate(validation.saveUserTenant), controller.updateTenant);

router.route('/:id').get(controller.getTenantById); //done

router.get('/:id/contracts', controller.getTenantContracts); //done

export default router;
