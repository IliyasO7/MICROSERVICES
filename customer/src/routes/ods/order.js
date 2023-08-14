import { Router } from 'express';
import * as controller from '../../controllers/ods/order.js';
import * as validation from '../../validation/ods/order.js';
import { validate } from '../../../../shared/utils/helper.js';
import { checkAuth } from '../../middleware/checkAuth.js';

const router = Router();

router
  .route('/')
  .get(checkAuth(), controller.getOrders)
  .post(checkAuth(), validate(validation.createOrder), controller.createOrder);

router.get('/summary', checkAuth(), controller.getOrderSummary);

router.get('/:id', checkAuth(), controller.getOrderById);

router.post('/:id/confirm', controller.confirmOrder);

export default router;
