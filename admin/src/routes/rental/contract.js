import { Router } from 'express';
import * as controller from '../../controllers/rental/contract.js';

const router = Router();

router.route('/').get(controller.getContracts);

router.route('/:contractId').get(controller.getContractById);

export default router;
