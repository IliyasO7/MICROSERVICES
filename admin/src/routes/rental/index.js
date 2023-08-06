import { Router } from 'express';
import dashboardRoutes from './dashboard.js';
import contractRoutes from './contract.js';
import propertyRoutes from './property.js';
import ownerRoutes from './owner.js';
import tenantRoutes from './tenant.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/owners', ownerRoutes);
router.use('/tenants', tenantRoutes);
router.use('/properties', propertyRoutes);
router.use('/contracts', contractRoutes);

export default router;
