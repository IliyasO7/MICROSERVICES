import { sendResponse } from '../../../shared/utils/helper.js';
import userRouter from './user.js';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';

import Router from 'express';
import checkAuth from '../middleware/checkAuth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', checkAuth, profileRoutes);

router.use('/', userRouter);

router.use((req, res) => {
  sendResponse(res, 404, 'Route Not Found', null, { path: req.path });
});

export default router;
