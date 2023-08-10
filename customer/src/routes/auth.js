import { Router } from 'express';
import * as controller from '../controllers/auth.js';
import * as validation from '../validation/auth.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();

router.post('/send-otp', validate(validation.sendOtp), controller.sendOtp);

router.post(
  '/verify-otp',
  validate(validation.verifYOtp),
  controller.verifyOtp
);

router.post('/register', validate(validation.register), controller.register);

export default router;
