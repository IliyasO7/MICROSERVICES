import { Router } from 'express';
import * as controller from '../controllers/contract.js';
import * as validation from '../validation/profile.js';
import { validate } from '../../../shared/utils/helper.js';

const router = Router();



//logged in admin Booking
router
  .route('/') 
  .get(controller.getAllBookings)

//booking with id
router
    .route('/:contractId') 
    .get(controller.getBookingDetails)

router
    .route('/:contractId/payments') 
    .get(controller.getPayments)


    //joi to be added
router
    .route('/:contractId/token-payment') 
    .post(controller.tokenPayment)

    //joi to be added
router
    .route('/:contractId/deposit-payment') 
    .post(controller.depositPayment)

    //joi to be added
router
    .route('/:contractId/rent-payment') 
    .post(controller.rentPayment)

    //joi to be added
router
    .route('/contract-status') 
    .get(controller.getContaractWithStatus)

    //joi to be added
router
    .route('/contract-status') 
    .get(controller.getPaymentWithStatus)





export default router;
