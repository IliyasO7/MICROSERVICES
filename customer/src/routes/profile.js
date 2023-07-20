import { Router } from 'express';
import * as controller from '../controllers/profile.js';
import * as validation from '../validation/profile.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getProfile)
  .post(validate(validation.createProfile), controller.createProfile)
  .patch(validate(validation.updateProfile), controller.updateProfile);

router
  .route('/addresses')
  .get(controller.getAddresses)
  .post(validate(validation.createAddress), controller.createAddress);

router
  .route('/addresses/:id')
  .get(controller.getAddressById)
  .patch(validate(validation.updateAddress), controller.updateAddress)
  .delete(controller.deleteAddress);

router
  .route('/bank-accounts')
  .get(controller.getBankAccounts)
  .post(validate(validation.createBankAccount), controller.createBankAccount);

router
  .route('/bank-accounts/:id')
  .get(controller.getBankAccountById)
  .patch(validate(validation.updateBankAccount), controller.updateBankAccount)
  .delete(controller.deleteBankAccount);

export default router;
