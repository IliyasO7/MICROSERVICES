import { Router } from 'express';
import * as controller from '../controllers/payment.js';

const router = Router();

router.get('/:id/payu-checkout', controller.getPayuCheckout);

export default router;
