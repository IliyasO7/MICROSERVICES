import { Router } from 'express';
import dashboardRoutes from './dashboard.js';
import contractRoutes from './contract.js';
import propertyRoutes from './property.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/properties', propertyRoutes);
router.use('/contracts', contractRoutes);

export default router;
