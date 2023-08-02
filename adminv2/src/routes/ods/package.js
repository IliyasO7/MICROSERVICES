import { Router } from 'express';
import * as controller from '../../controllers/ods/package.js';
import * as validation from '../../validation/ods/package.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getPackages)
  .post(validate(validation.createPackage), controller.createPackage);

router
  .route('/:id')
  .get(controller.getPackageById)
  .patch(validate(validation.updatePackage), controller.updatePackage)
  .delete(controller.deletePackage);

export default router;
