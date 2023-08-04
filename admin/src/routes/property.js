import Router from 'express';
import multer from 'multer';
import * as controller from '../controllers/property.js';
import * as validation from '../validation/property.js';
import { validate, checkAuthAdmin } from '../../../shared/utils/helper.js';

const upload = multer({ dest: 'uplaod/' });

const router = Router();

router
  .route('/')
  .get(controller.getProperties)
  .post(validate(validation.createProperty), controller.createProperty);

router.route('/:id').get(controller.getPropertyById);

router.post(
  '/:propertyId/media',
  upload.fields([
    { name: 'mainImage' },
    { name: 'entranceImage' },
    { name: 'livingImage' },
    { name: 'kitchenImage' },
    { name: 'bedroomImage' },
  ]),
  controller.updatePropertyImages
);

export default router;
