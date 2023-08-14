import { Router } from 'express';
import serviceRoutes from './service.js';
import cartRoutes from './cart.js';
import orderRoutes from './order.js';
import { checkAuth } from '../../middleware/checkAuth.js';

const router = Router();

router.use('/cart', checkAuth(), cartRoutes);
router.use('/orders', checkAuth(), orderRoutes);
router.use('/services', serviceRoutes);

export default router;
