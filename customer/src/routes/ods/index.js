import { Router } from 'express';
import serviceRoutes from './service.js';
import cartRoutes from './cart.js';
import orderRoutes from './order.js';

const router = Router();

router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/services', serviceRoutes);

export default router;
