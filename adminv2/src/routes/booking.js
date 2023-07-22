import * as controller from "../controllers/booking.js"
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";

const router = Router();

//logged in admin Booking
router
  .route('/') 
  .get(controller.getAllBookings)

//booking with id
router
    .route('/:bookingId') 
    .get(controller.getBookingDetails)

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



export default router;