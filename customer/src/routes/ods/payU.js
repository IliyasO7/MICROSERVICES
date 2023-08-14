import { Router } from 'express';
import * as controller from '../../controllers/payU.js';
import * as validation from '../../validation/payU.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router.post(
  '/getHash',
  validate(validation.payUPayload),
  controller.payUMoneyPayment
);

router.post(
  '/verifyHash',
  validate(validation.payUResponse),
  controller.payUResponse
);

router.get('/payment', controller.createPayment);

export default router;
