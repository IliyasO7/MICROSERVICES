import { Router } from 'express';
import serviceRoutes from './service.js';

const router = Router();

router.use('/services', serviceRoutes);

export default router;
