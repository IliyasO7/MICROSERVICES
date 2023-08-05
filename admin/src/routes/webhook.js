import Router from 'express';
import * as controller from '../controllers/webhook.js';

const router = Router();

router.post('/zapier/leads/ods', controller.createZapierOdsLead);

export default router;
