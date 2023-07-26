import User from "../../../shared/models/user.js";
import RentalTenant from "../../../shared/models/rentalTental.js";
import Inventory from "../../../shared/models/inventory.js";
import Booking from "../../../shared/models/Booking.js";
import Contract from "../../models/contract.js";
import RentalTransactions from "../../../shared/models/rentalTransactions.js";
import RentalOwner from "../../../shared/models/rentalOwner.js";
import Property from "../../models/property.js";
import Contract from "../../models/contract.js";
import dayjs from "dayjs";
import { sendResponse } from "../../../shared/utils/helper.js";

export const getTenant = async (req, res) => {
  const mobile = req.params.mobile;
  const tenantDetails = await User.findOne({
    mobile: mobile,
    "tenant.isActive": true,
  }).populate("tenant.addedBy");

  const contractDetails = await Contract.find({ tenant: tenantDetails._id })
    .populate("property")
    .populate("proprietor");

  return sendResponse(res, 200, "Tenant Details Fetched Successfully", {
    tenantDetails,
    contractDetails,
  });
};

export const createTenant = async (req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const propertyId = req.body.propertyId;
  const tenantStatus = req.body.isTenant;
  const tokenAdvance = req.body.tokenAdvance;
  const moveInDate = req.body.moveInDate;
  const moveOutDate = req.body.moveOutDate;
  const commision = req.body.commision;

  console.log("move in", moveInDate);
  console.log("req body move in", req.body.moveInDate);

  const dueDates = dayjs(moveInDate).add(1, "month").toDate();
  console.log("due", dueDates);

  const admin = req.user;
  const to = req.body.ownerId;

  const userCheck = await User.findOne({ mobile: mobile });
  if (userCheck) {
    const tenantCheck = await User.findOne({
      _id: userCheck._id,
      "tenant.isActive": true,
    });
    if (tenantCheck) {
      return sendResponse(res, 400, "Tenant Already Exists");
    }
  }

  const saveUser = await User.create({
    fname: fname,
    email: email,
    mobile: mobile,
    "tenant.isActive": true,
    "tenant.addedBy": admin,
  });

  const updatedInventoryData = await Property.updateOne(
    { _id: propertyId },
    {
      moveInDate: moveInDate,
      tokenAmount: tokenAdvance,
    }
  );

  const totalBookings = await Contract.countDocuments({});
  let currentBookingNo = totalBookings + 1;
  const sku = `HJR${currentBookingNo}`;
  const propertyDetails = await Property.findOne({ _id: propertyId });
  console.log("property Details", propertyDetails);

  // const dueDates = dayjs(moveInDate).add(1, 'month').toDate()

  const Bookings = await Contract.create({
    tenant: saveUser._id,
    contractId: sku,
    property: propertyId,
    proprietor: propertyDetails.proprietor,
    rentAmount: propertyDetails.rent,
    moveInDate: moveInDate,
    moveOutDate: moveOutDate,
    dueDate: dueDates,
    commissionPercentage: commision, //by default 5
    "tokenAdvance.amount": tokenAdvance,
    "securityDeposit.amount": propertyDetails.depositAmount,
    createdBy: admin,
  });
  return sendResponse(res, 200, "Tenant And Contract Added successfully", {
    saveUser,
    updatedInventoryData,
    Bookings,
  });
};

/*
export const createTenant = async (req, res) => {
    const fname = req.body.fname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const inventoryId = req.body.inventoryId;
    const tenantStatus= req.body.isTenant;
    const tokenAdvance = req.body.tokenAdvance;
    const moveInDate = new Date() || req.body.moveInDate;
    console.log('move in',moveInDate);
    console.log(' req body move in',req.body.moveInDate);
  
    const admin = req.user;
    const to = req.body.ownerId;

    const userCheck = await User.findOne({mobile: mobile})
    if(userCheck){
      const tenantCheck = await RentalOwner.find({user:userCheck._id})
      if(tenantCheck){
        sendResponse(res, 400, "Tenant Already Exists", );
      }
    }


        const saveUser = await User.create(
          {
            fname: fname,
            email: email,
            mobile: mobile,
          //  isTenant: tenantStatus,
          });

        const createUserAsTenant = await RentalTenant.create({
            user:saveUser,
            createdBy: admin,
        }) 
      
        const updatedInventoryData = await Inventory.updateOne(
          { _id: inventoryId },
          { 
            moveInDate : moveInDate,
            tokenAdvance:tokenAdvance
          })

          const date =  moveInDate.getDate() - 3;
            const year =  moveInDate.getFullYear();
            const month = moveInDate.getMonth()+1;
            const dueDate = new Date(`${year}-${month}-${date}`);

  
          const totalBookings = await Booking.countDocuments({});
          let currentBookingNo = totalBookings + 1;
          const sku = `HJR${currentBookingNo}`
          const inventoryDetails = await Inventory.findOne({_id : inventoryId})
                const Bookings = await Booking.create({
                  tenant: saveUser._id,     
                  bookingId: sku,
                  inventory: inventoryId,  
                  owner : inventoryDetails.user,
                  createdBy:admin,
                  balanceAmount:inventoryDetails.securityDeposit,
                  rentAmount:  inventoryDetails.rent,
                //  'serviceCharge.percentage': req.body.serviceCharge,
                  'tokenAmount.amount':  tokenAdvance,
                  'securityDeposit.amount': inventoryDetails.securityDeposit,
                  'securityDeposit.paymentDue': dueDate
                })

                const paidFromStartMonth =  moveInDate.getMonth() + 1;
              //  console.log('month',paidFromStartMonth);
                const paidFromStartDate =  1 ;
                const paidYear =  moveInDate.getFullYear();
               // console.log(paidYear)
                //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
                const paidFrom = new Date(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`);
                const nextMonth = moveInDate.getMonth() + 2
               // console.log('next month',nextMonth)
                const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`)
               // console.log(paidUntil)
  
                const rentTransaction = await  RentalTransactions.create({
                      from: saveUser._id,     
                      bookingId: Bookings,
                      transactionFor: 'RENT',
                      to : inventoryDetails.user,
                      amount: inventoryDetails.rent,
                      createdBy:admin,
                      paidFrom: paidFrom,
                      paidUntil:paidUntil,
                })  
    sendResponse(res, 200, "Tenant And Booking Added successfully", {saveUser,createUserAsTenant,updatedInventoryData,Bookings,rentTransaction});
};
*/

export const updateTenant = async (req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const inventoryId = req.body.inventoryId;
  const tenantStatus = req.body.isTenant;
  const tokenAdvance = req.body.tokenAdvance;
  const moveInDate = new Date() || req.body.moveInDate;
  console.log("move in", moveInDate);
  console.log(" req body move in", req.body.moveInDate);

  const admin = req.user;
  const to = req.body.ownerId;

  const user = await User.findOne({ mobile: mobile });

  const saveUser = await User.updateOne(
    { mobile: mobile },
    {
      fname: fname,
      email: email,
    }
  );

  const updatedInventoryData = await Inventory.updateOne(
    { _id: inventoryId },
    {
      moveInDate: moveInDate,
      tokenAdvance: tokenAdvance,
    }
  );

  const totalBookings = await Booking.countDocuments({});
  console.log("total Inventory", totalBookings);
  let currentBookingNo = totalBookings + 1;
  const sku = `HJR${currentBookingNo}`;
  console.log("SKU", sku);

  const inventoryDetails = await Inventory.findOne({ _id: inventoryId });
  console.log("INVENTORY", inventoryDetails);

  const Bookings = await Booking.updateOne(
    { tenant: user, inventoryId: inventoryId },
    {
      "tokenAmount.amount": tokenAdvance,
    }
  );

  //  const moveInDate = new Date("2023-07-11T05:55:04.603+00:00")
  console.log("move In date", moveInDate);
  //   const d = moveInDate.getMonth() +1 ;
  //   console.log(d)
  const paidFromStartMonth = moveInDate.getMonth() + 1;
  console.log("month", paidFromStartMonth);
  const paidFromStartDate = 1;
  const paidYear = moveInDate.getFullYear();
  console.log(paidYear);
  //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
  const paidFrom = new Date(
    `${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`
  );
  const nextMonth = moveInDate.getMonth() + 2;
  console.log("next month", nextMonth);
  const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`);
  console.log(paidUntil);

  const Booking = await Booking.findOne({
    tenant: tenant,
    inventory: inventoryId,
  });

  const rentTransaction = await RentalTransactions.updateOne(
    { inventory: inventoryId, tenant: user },
    {
      paidFrom: paidFrom,
      paidUntil: paidUntil,
    }
  );
  sendResponse(res, 200, "Tenant Added successfully", {
    saveUser,
    updatedInventoryData,
    Bookings,
    rentTransaction,
  });
};

//GET ADMIN TENANTS
export const getAdminTenants = async (req, res) => {
  const userId = req.user;
  const tenants = await User.find({
    "tenant.addedBy": userId._id,
    "tenant.isActive": true,
  });
  return sendResponse(res, 200, "Tenants Fetched Successfully", tenants);
};

//GET ALL TENANTS
export const getAllTenants = async (req, res) => {
  let tenants = await User.find({ "tenant.isActive": true });
  return sendResponse(res, 200, "Tenants Fetched Successfully", tenants);
};
