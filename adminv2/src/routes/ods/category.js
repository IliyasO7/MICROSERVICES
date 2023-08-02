import { Router } from 'express';
import * as controller from '../../controllers/ods/category.js';
import * as validation from '../../validation/ods/category.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getCategory)
  .post(validate(validation.createCategory), controller.createCategory);

router
  .route('/:id')
  .get(controller.getCategoryById)
  .patch(validate(validation.updateCategory), controller.updateCategory)
  .delete(controller.deleteCategory);

export default router;
