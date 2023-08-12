import { Router } from 'express';
import * as controller from '../../controllers/rental/property.js';

const router = Router();

router.get('/', controller.getProperties);
router.get('/:id', controller.getPropertyById);

export default router;
