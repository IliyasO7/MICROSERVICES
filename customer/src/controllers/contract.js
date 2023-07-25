import { sendResponse } from "../../../shared/utils/helper.js";
import Contract from "../../models/contract.js";
import ContractPayment  from "../../models/contractPayment.js";

/*
'/contracts/:id/token-payment'
'/contracts/:id/security-deposit'
'/contracts/:id/rent'
*/


//Get All Bookings created by admin
export const getAllBookings = async (req, res) => {
    const userId = req.user;
         let allBookings = await Contract.find({userId}).populate('property').populate('proprietor').populate('tenant')
         return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };


//GET Booking Details wrt id
export const getBookingDetails = async (req, res) => {
    const userId = req.user;
  if(!req.params.contractId){
    return sendResponse(res, 400, "Parameters Required");
  }
    let allBookings = await Contract.find({ _id : req.params.contractId }).populate('property').populate('proprietor').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
  };



export const getPayments = async (req, res) => {
  const userId = req.user;
  if(!req.params.contractId){
    return sendResponse(res, 400, "Parameters Required");
  }
    let payments = await  ContractPayment.find({ contract: req.params.contractId, });
    return sendResponse(res, 200, "Bookings Fetched Successfully", { payments });
};


  export const tokenPayment = async (req, res) => {
    const userId = req.user;
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
      const userId = req.user;
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
     const userId = req.user;
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
  const userId = req.user;
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
const userId = req.user;
  const filter = {};
  if (req.query.status) {
      filter['status'] = req.query.status
  }else{
    return sendResponse(res, 400, "Parameters Required");
  }
    let allBookings = await ContractPayment.find({filter}).populate('property').populate('proprietor').populate('tenant');
    return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
};
