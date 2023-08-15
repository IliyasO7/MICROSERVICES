import { Router } from 'express';
import ownerRoutes from './owner.js';
import tenantRoutes from './tenant.js';
import propertyRoutes from './property.js';
import { checkAuth } from '../../middleware/checkAuth.js';

const router = Router();

router.use('/owner', checkAuth(), ownerRoutes);
router.use('/tenant', tenantRoutes);
router.use('/properties', checkAuth(), propertyRoutes);

export default router;
