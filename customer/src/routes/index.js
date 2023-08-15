import Router from 'express';
import { sendResponse } from '../../../shared/utils/helper.js';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import rentalRoutes from './rental/index.js';
import odsRoutes from './ods/index.js';
import paymentRoutes from './payment.js';

import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', checkAuth(), profileRoutes);
router.use('/rental', rentalRoutes);
router.use('/ods', odsRoutes);
router.use('/payments', paymentRoutes);

router.use((req, res) => {
  sendResponse(res, 404, 'Route Not Found', null, { path: req.path });
});

export default router;
