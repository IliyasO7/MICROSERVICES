import { Router } from 'express';
import * as controller from '../../controllers/rental/contract.js';
import * as validation from '../../validation/rental/contract.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getContracts)
  .post(validate(validation.createContract), controller.createContract);

router
  .route('/:id')
  .get(controller.getContractById)
  .patch(validate(validation.updateContract), controller.updateContract)
  .delete(controller.deleteContract);

export default router;
