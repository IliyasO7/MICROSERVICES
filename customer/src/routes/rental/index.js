import { Router } from 'express';
import ownerRoutes from './owner.js';
import tenantRoutes from './tenant.js';
import propertyRoutes from './property.js';

const router = Router();

router.use('/owner', ownerRoutes);
router.use('/tenant', tenantRoutes);
router.use('/properties', propertyRoutes);

export default router;
