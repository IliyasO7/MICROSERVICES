import { Router } from 'express';
import * as controller from '../../controllers/rental/owner.js';
import * as validation from '../../validation/rental/owner.js';
import { validate } from '../../../../shared/utils/helper.js';

const router = Router();

router
  .route('/')
  .get(controller.getOwners)
  .post(validate(validation.createOwner), controller.createOwner);

router.route('/:id').get(controller.getOwnerById);

router.get('/:id/properties', controller.getOwnerProperties);

router.get('/:id/contracts', controller.getOwnerContracts);

export default router;
