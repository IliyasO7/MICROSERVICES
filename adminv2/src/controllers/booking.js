import Booking from "../../../shared/models/Booking.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import dayjs from 'dayjs';
import axios from "axios";
import Contract from "../../models/contract.js";
import ContractPayment, { ContractPaymentStatus } from "../../models/contractPayment.js";


//Get All Bookings created by admin
export const getAllBookings = async (req, res) => {
    const userId = req.user;
         let allBookings = await Contract.find({ createdBy :userId }).populate('property').populate('proprietor').populate('tenant')
         return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };


//GET Booking Details wrt id
export const getBookingDetails = async (req, res) => {
  if(!req.params.contractId){
    return sendResponse(res, 400, "Parameters Required");
  }
    let allBookings = await Contract.find({ _id : req.params.contractId }).populate('property').populate('proprietor').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



//GET Contract w.r.t status
export const getContaractWithStatus = async (req, res) => {
  const filter = {};
  if (req.query.status) {
      filter['status'] = req.query.status
  }else{
    return sendResponse(res, 400, "Parameters Required");
  }
    let allBookings = await Contract.find({filter}).populate('property').populate('proprietor').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
};




  /*

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
  */