import { Router } from 'express';
import * as controller from '../../controllers/rental/tenant.js';
import { checkAuth } from '../../middleware/checkAuth.js';

const router = Router();

router.get('/contracts', checkAuth(), controller.getContracts);
router.get('/contracts/:id', checkAuth(), controller.getContractById);
router.get('/contracts/:id/payments', checkAuth(), controller.getPayments);

router.post(
  '/contracts/:id/token-payment',
  checkAuth(),
  controller.tokenPayment
);
router.post(
  '/contracts/:id/token-payment-confirm',
  controller.tokenPaymentConfirm
);

router.post(
  '/contracts/:id/deposit-payment',
  checkAuth(),
  controller.depositPayment
);
router.post(
  '/contracts/:id/deposit-payment-confirm',
  controller.depositPaymentConfirm
);

router.post('/contracts/:id/rent-payment', checkAuth(), controller.rentPayment);
router.post(
  '/contracts/:id/rent-payment-confirm',
  controller.rentPaymentConfirm
);

export default router;
