import * as controller from "../controllers/booking.js"
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";

const router = Router();

/*
'/contracts'
'/contracts/:id'
'/contracts/:id/payments'
'/contracts/:id/token-payment'
'/contracts/:id/security-deposit'
'/contracts/:id/rent'

*/


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


router
    .route('/:contractId/token-payment') 
    .post(controller.tokenPayment)

router
    .route('/:contractId/deposit-payment') 
    .post(controller.depositPayment)

router
    .route('/:contractId/rent-payment') 
    .post(controller.rentPayment)

router
    .route('/contract-status') 
    .get(controller.getContaractWithStatus)

router
    .route('/payment-status') 
    .get(controller.getPaymentWithStatus)


/*    
//booking with owner Id
router
    .route('/owner/:ownerId') 
    .get(controller.getOwnerBookingDetails)

//booking with owner Id
router
    .route('/tenant/:tenantId') 
    .get(controller.getTenantBookingDetails)

//all bookings
router
    .route('/all') 
    .get(controller.allBookings)

*/

export default router;