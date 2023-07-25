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
    let allBookings = await Contract.find({ bookingId : req.params.contractId }).populate('property').populate('proprietor').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



export const getPayments = async (req, res) => {
  if(!req.params.contractId){
    return sendResponse(res, 400, "Parameters Required");
  }
    let payments = await  ContractPayment.find({contract: req.params.contractId});
    return sendResponse(res, 200, "Bookings Fetched Successfully", { payments });
  };


  export const tokenPayment = async (req, res) => {
    if(!req.params.contractId){
      return sendResponse(res, 400, "Parameters Required");
    }
    let  type = 'token';
    let  contractId = req.params.contractId;
    let  amount = req.body.amount;
    let  status = req.body.status;

      let payment = await  ContractPayment.create({
         contract: contractId,
         type:type,
         amount:amount,
         status:status,
        });
      return sendResponse(res, 200, "Contract Created Successfully", { payment });
    };


export const depositPayment = async (req, res) => {
      if(!req.params.contractId){
        return sendResponse(res, 400, "Parameters Required");
      }
      let  type = 'deposit';
      let  contractId = req.params.contractId;
      let  amount = req.body.amount;
      let  status = req.body.status;
  
        let payment = await  ContractPayment.create({
              contract: contractId,
              type:type,
              amount:amount,
              status:status,
          });
        return sendResponse(res, 200, "Contract Created Successfully", { payment });
};



export const rentPayment = async (req, res) => {
      if(!req.params.contractId){
        return sendResponse(res, 400, "Parameters Required");
      }
      let  type = 'rent';
      let  contractId = req.params.contractId;
      let  amount = req.body.amount;
      let  status = req.body.status;

        let payment = await  ContractPayment.create({
              contract: contractId,
              type:type,
              amount:amount,
              status:status,
          });
        return sendResponse(res, 200, "Contract Created Successfully", { payment });
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


//GET Contract w.r.t status
export const getPaymentWithStatus = async (req, res) => {
  const filter = {};
  if (req.query.status) {
      filter['status'] = req.query.status
  }else{
    return sendResponse(res, 400, "Parameters Required");
  }
    let allBookings = await ContractPayment.find({filter}).populate('property').populate('proprietor').populate('tenant');
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