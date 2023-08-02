import { Router } from 'express';
import * as controller from '../../controllers/ods/cart.js';
import * as validation from '../../validation/ods/cart.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router.get('/', controller.getCart);
router.get('/:id', controller.getCartById);

router.post('/add-item', validate(validation.addItem), controller.addItem);

router.post(
  '/remove-item',
  validate(validation.removeItem),
  controller.removeItem
);

router.post('/clear', validate(validation.clearCart), controller.clearCart);

export default router;
