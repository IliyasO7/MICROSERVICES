import { Router } from 'express';
import * as controller from '../../controllers/ods/service.js';
import * as validation from '../../validation/ods/service.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getServices)
  .post(validate(validation.createService), controller.createService);

router
  .route('/:id')
  .get(controller.getServiceById)
  .patch(validate(validation.updateService), controller.updateService)
  .delete(controller.deleteService);

export default router;
