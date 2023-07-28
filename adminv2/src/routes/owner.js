import { Router } from 'express';
import * as controller from '../controllers/owner.js';
import * as validation from '../validation/admin.js';
import { validate, checkAuthAdmin } from '../../../shared/utils/helper.js';
import multer from 'multer';
const upload = multer({ dest: 'uplaod/' });

const router = Router();

router
  .route('/')
  .get(controller.getOwners)
  .post(validate(validation.createOwner), controller.createOwner);

router.route('/:id').get(controller.getOwnerById);

router.get('/:id/properties', controller.getOwnerProperties);

router.get('/:id/contracts', controller.getOwnerContracts);

router.post(
  '/:id/media',
  upload.fields([
    { name: 'aadhar' },
    { name: 'pan' },
    { name: 'cancelledCheque' },
  ]),
  controller.updateOwnerMedia
);

export default router;
