import * as controller from '../../controllers/rental/contract.js';
import Router from 'express';

const router = Router();

router.route('/').get(controller.getAllContracts);

router.route('/:contractId').get(controller.getContractById);

export default router;
