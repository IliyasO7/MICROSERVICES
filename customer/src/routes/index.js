import { sendResponse } from '../../../shared/utils/helper.js';
import userRouter from './user.js';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import contractRoutes from './contract.js';

import Router from 'express';
import  {checkAuth } from '../middleware/checkAuth.js';
//import { checkAuth } from '../../../shared/utils/helper.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', checkAuth(), profileRoutes);
router.use('/contracts', checkAuth(), contractRoutes);

router.use('/', userRouter);

router.use((req, res) => {
  sendResponse(res, 404, 'Route Not Found', null, { path: req.path });
});

export default router;
