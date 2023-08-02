import { Router } from 'express';
import * as controller from '../../controllers/ods/catalog.js';
import * as validation from '../../validation/ods/catalog.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getCatalog)
  .post(validate(validation.createCatalog), controller.createCatalog);

router
  .route('/:id')
  .get(controller.getCatalogById)
  .patch(validate(validation.updateCatalog), controller.updateCatalog)
  .delete(controller.deleteCatalog);

export default router;
