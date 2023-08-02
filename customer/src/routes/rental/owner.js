import { Router } from 'express';
import * as controller from '../../controllers/rental/owner.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router.route('/contracts').get(controller.getContracts);

router.route('/contracts/:id').get(controller.getContractById);

router.route('/contracts/:id/payments').get(controller.getPayments);

export default router;
