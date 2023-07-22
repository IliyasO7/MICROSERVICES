import Booking from "../../../shared/models/Booking.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import dayjs from 'dayjs';




//Get All Bookings created by admin
export const getAllBookings = async (req, res) => {
    const userId = req.user;
         let allBookings = await Booking.find({ createdBy :userId }).populate('owner').populate('tenant').populate('inventory')
         return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };


//GET Booking Details wrt id
export const getBookingDetails = async (req, res) => {
    let allBookings = await Booking.find({ bookingId : req.params.bookingId }).populate('inventory').populate('owner').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



//GET Booking details wrt owner
export const getOwnerBookingDetails = async (req, res) => {
    let allBookings = await Booking.find({ owner : req.params.ownerId }).populate('inventory').populate('owner').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



//GET Booking details wrt  tenant
export const getTenantBookingDetails = async (req, res) => {
    let allBookings = await Booking.find({ tenant : req.params.tenantId }).populate('inventory').populate('owner').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



//GET Booking Details
export const allBookings = async (req, res) => {
         let allBookings = await Booking.find({  }).populate('owner').populate('tenant').populate('inventory')
         return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };