import Router from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { sendResponse } from '../../../shared/utils/helper.js';

import authRoutes from './auth.js';
import odsRoutes from './ods/index.js';
import rentalRoutes from './rental/index.js';
import webhookRoutes from './webhook.js';
import leadRoutes from './lead.js';
import userRoutes from './user.js';
import s3Routes from './s3.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ods', checkAuth(), odsRoutes);
router.use('/rental', checkAuth(), rentalRoutes);
router.use('/users', checkAuth(), userRoutes);
router.use('/leads', checkAuth(), leadRoutes);
router.use('/webhook', checkAuth(), webhookRoutes);
router.use('/s3', s3Routes);

router.use((req, res) => {
  sendResponse(res, 404, 'Route Not Found', null, { path: req.path });
});

export default router;
