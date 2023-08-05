import { Router } from 'express';
import * as controller from '../../controllers/ods/order.js';
import * as validation from '../../validation/ods/order.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getOrders)
  .post(validate(validation.createOrder), controller.createOrder);

router.get('/summary', controller.getOrderSummary);

router.get('/:id', controller.getOrderById);

router.post(
  '/:id/confirm',
  validate(validation.confirmOrder),
  controller.confirmOrder
);

export default router;
