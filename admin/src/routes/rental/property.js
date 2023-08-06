import Router from 'express';
import * as controller from '../../controllers/rental/property.js';
import * as validation from '../../validation/property.js';
import { validate, checkAuthAdmin } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getProperties)
  .post(validate(validation.createProperty), controller.createProperty);

router.route('/:id').get(controller.getPropertyById);

router.post('/:propertyId/media', controller.updatePropertyImages);

export default router;
