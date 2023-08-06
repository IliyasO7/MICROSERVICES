import { Router } from 'express';
import * as controller from '../../controllers/rental/dashboard.js';

const router = Router();

router.get('/overview', controller.getOverview);

export default router;
