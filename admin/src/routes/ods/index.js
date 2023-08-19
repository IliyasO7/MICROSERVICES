import { Router } from 'express';
import categoryRoutes from './category.js';
import serviceRoutes from './service.js';
import packageRoutes from './package.js';
import vendorRoutes from './vendor.js';
import orderRoutes from './order.js';

const router = Router();

router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/packages', packageRoutes);

export default router;
