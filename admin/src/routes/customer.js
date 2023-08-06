import { Router } from 'express';
import * as controller from '../controllers/customer.js';
import * as validation from '../validation/customer.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();

router.route('/').get(controller.getCustomers);

router
  .route('/:id')
  .get(controller.getCustomerById)
  .patch(validate(validation.updateCustomer), controller.updateCustomer)
  .delete(controller.deleteCustomer);

export default router;
