import { Router } from 'express';
import ownerRoutes from './owner.js';
import tenantRoutes from './tenant.js';

const router = Router();

router.use('/owner', ownerRoutes);
router.use('/tenant', tenantRoutes);

export default router;
