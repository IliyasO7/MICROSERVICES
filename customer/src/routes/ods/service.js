import { Router } from 'express';
import * as controller from '../../controllers/ods/service.js';

const router = Router();

router.get('/', controller.getServices);

router.get('/:id', controller.getServiceById);

router.get('/:id/packages', controller.getServicePackages);

export default router;
