import Router from 'express';
import * as controller from '../controllers/webhook.js';
import * as validation from '../validation/webhook.js';
import { validate, verifyAPIKey } from '../../../shared/utils/helper.js';

const router = Router();

router.post(
  '/zapier/lead',
  verifyAPIKey,
  validate(validation.createZapierLead),
  controller.createZapierLead
);

export default router;
