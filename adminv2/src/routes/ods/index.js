import { Router } from 'express';
import serviceRoutes from './service.js';
import catalogRoutes from './catalog.js';
import categoryRoutes from './category.js';
import vendorRoutes from './vendor.js';

const router = Router();

router.use('/services', serviceRoutes);
router.use('/catalogs', catalogRoutes);
router.use('/categories', categoryRoutes);
router.use('/vendors', vendorRoutes);

export default router;
