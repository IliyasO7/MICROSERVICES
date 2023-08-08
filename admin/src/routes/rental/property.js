import Router from 'express';
import * as controller from '../../controllers/rental/property.js';
import * as validation from '../../validation/rental/property.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getProperties)
  .post(validate(validation.createProperty), controller.createProperty);

router
  .route('/:id')
  .get(controller.getPropertyById)
  .patch(controller.updateProperty)
  .delete(controller.deleteProperty);

export default router;
