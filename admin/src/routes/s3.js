import { Router } from 'express';
import * as controller from '../controllers/s3.js';

const router = Router();

router.get('/base-url', controller.getBaseUrl);
router.post('/signed-url', controller.createSignedUrl);

export default router;
