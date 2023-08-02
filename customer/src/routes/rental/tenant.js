import { Router } from 'express';
import * as controller from '../../controllers/rental/tenant.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router.route('/contracts').get(controller.getContracts);

router.route('/contracts/:id').get(controller.getContractById);

router.route('/contracts/:id/payments').get(controller.getPayments);

//joi to be added
router.route('/contracts/:id/token-payment').post(controller.tokenPayment);

//joi to be added
router.route('/contracts/:id/deposit-payment').post(controller.depositPayment);

//joi to be added
router.route('/contracts/:id/rent-payment').post(controller.rentPayment);

export default router;
