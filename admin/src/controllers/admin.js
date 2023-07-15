import Admin from "../../../shared/models/admin.js";
import User from "../../../shared/models/user.js";
import RentalTenant from "../../../shared/models/rentalTental.js";
import Inventory from "../../../shared/models/inventory.js";
import Booking from "../../../shared/models/Booking.js";
import Bank from "../../../shared/models/bank.js";
import RentalTransactions from "../../../shared/models/rentalTransactions.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";
import RentalOwner from "../../../shared/models/rentalOwner.js";
//import { default as bunnycdn  } from "bunnycdn-storage"
//import {bunnycdn } from "../../../old/src/services/bunnycdn.js";
//const bunnycdn = require("../../../old/src/services/bunnycdn.js")

import  fs  from  "fs";
import axios from "axios";

export const createSuperAdmin = async (req, res) => {

    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }

            const totalAdmins = await Admin.find({role:'HJ-SUPER-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-SUPER-ADMIN-${currentAdminNo}`;
           // const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
      
            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:`HJ-SUPER-ADMIN`,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,

            })
        if(saveUser) sendResponse(res, 200, "Super Admin Created Successfully", {saveUser});
        
};

export const createOdsAdmin = async (req, res) => {
    console.log('create ODS ADMIN');

    const superAdmin = req.user;
    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }

            const totalAdmins = await Admin.find({role:'HJ-ODS-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-ODS-ADMIN-${currentAdminNo}`;

            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:role,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,
                createdBy:superAdmin._id,

            })
        if(saveUser) sendResponse(res, 200, "Ods Admin Created Successfully", {saveUser});
        
};


export const createRentalAdmin = async (req, res) => {

    const superAdmin = req.user;
    const username = req.body.username;
    const role = req.body.role;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

            let encryptedPassword = await bcrypt.hash(password, 10)
            let adminExists = await Admin.findOne({ email: email });

            if(adminExists){
                return sendResponse(res, 400, "Admin Already Exists");
            }
            const totalAdmins = await Admin.find({role:'HJ-RENTAL-ADMIN'});
            let count = totalAdmins.length;
            console.log('total Admins',count);
            let currentAdminNo = count + 1;
           // let currentAdminNo =  1;
            const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
           // const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`
            const saveUser = await Admin.create({ 
                adminId: sku,
                username: username,
                role:`HJ-RENTAL-ADMIN`,
                fname:fname,
                lname:lname,
                email:email,
                password:encryptedPassword,
                createdBy:superAdmin._id,

            })
        if(saveUser) sendResponse(res, 200, "Rental Admin Created Successfully", {saveUser});
        
};

export const loginAdmin = async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    let adminData = await Admin.findOne({username:username})

    if(!adminData){
         return sendResponse(res, 400, "Admin Does Not Exists");
      }
     else{
        let verifyPassword = await bcrypt.compare(password, adminData.password)
        if(verifyPassword){
            const tokens = generateTokens({ userId: adminData._id });
            return sendResponse(res, 200, "Admin Login Successfully", {tokens,adminData});
        } 
     }     
};

export const getTenant = async (req, res) => {
    const mobile = req.params.mobile;
    let user = await User.findOne({mobile:mobile})
    if(user){
        let tenant = await RentalTenant.findOne({user: user})
        let booking = await Booking.find({tenant: tenant}) 
        let transactions = await RentalTransactions.find({from:tenant})

        console.log('Tenant',tenant);
        if(tenant){
            return sendResponse(res, 200, "Tenant Record Found Pls Udpate", {tenant,booking,transactions});
        }else{
            return sendResponse(res, 400, "User Does Not Exist As Tenant");
        }
    }else{
        return sendResponse(res, 400, "Tenant Does Not Exist");
    }   
};


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
  
          const totalBookings = await Booking.countDocuments({});
          console.log('total Inventory',totalBookings);
          let currentBookingNo = totalBookings + 1;
          const sku = `HJR${currentBookingNo}`
          console.log('SKU',sku);
    
          const inventoryDetails = await Inventory.findOne({_id : inventoryId})
          console.log('INVENTORY', inventoryDetails);
          const pendingDeposit = inventoryDetails.securityDeposit - tokenAdvance;
  
  
                const Bookings = await Booking.create({
                  tenant: saveUser._id,     
                  bookingId: sku,
                  inventory: inventoryId,  
                  owner : inventoryDetails.user,
                  createdBy:admin,
                  balanceAmount:pendingDeposit,
                //  'serviceCharge.percentage': req.body.serviceCharge,
                  'tokenAmount.amount':  tokenAdvance,
                  'securityDeposit.amount': inventoryDetails.securityDeposit
                })

              //  console.log('move In date',moveInDate)
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
                      transactionType: 'RENT',
                      to : inventoryDetails.user,
                      amount: inventoryDetails.rent,
                      createdBy:admin,
                      paidFrom: paidFrom,
                      paidUntil:paidUntil,
                })  
    sendResponse(res, 200, "Tenant And Booking Added successfully", {saveUser,createUserAsTenant,updatedInventoryData,Bookings,rentTransaction});

};

export const updateTenant = async (req, res) => {
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

    const user = await User.findOne({mobile:mobile});
  
        const saveUser = await User.updateOne(
            { mobile: mobile },
            {
                fname: fname,
                email: email,
            });
      
        const updatedInventoryData = await Inventory.updateOne(
          { _id: inventoryId },
          { 
            moveInDate : moveInDate,
            tokenAdvance:tokenAdvance
          })
  
          const totalBookings = await Booking.countDocuments({});
          console.log('total Inventory',totalBookings);
          let currentBookingNo = totalBookings + 1;
          const sku = `HJR${currentBookingNo}`
          console.log('SKU',sku);
    
          const inventoryDetails = await Inventory.findOne({_id : inventoryId})
          console.log('INVENTORY', inventoryDetails);
  
  
                const Bookings = await Booking.updateOne(
                { tenant:user, inventoryId:inventoryId },
                {
                    "tokenAmount.amount": tokenAdvance,
                })
    
                //  const moveInDate = new Date("2023-07-11T05:55:04.603+00:00")
                console.log('move In date',moveInDate)
            //   const d = moveInDate.getMonth() +1 ;
            //   console.log(d)
                const paidFromStartMonth =  moveInDate.getMonth() + 1;
                console.log('month',paidFromStartMonth);
                const paidFromStartDate =  1 ;
                const paidYear =  moveInDate.getFullYear();
                console.log(paidYear)
                //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
                const paidFrom = new Date(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`);
                const nextMonth = moveInDate.getMonth() + 2
                console.log('next month',nextMonth)
                const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`)
                console.log(paidUntil)

          const Booking = await Booking.findOne({ tenant:tenant, inventory:inventoryId})
  
          const rentTransaction = await  RentalTransactions.updateOne(
                {   inventory: inventoryId, tenant:user },
                {
                    paidFrom: paidFrom,
                    paidUntil:paidUntil,
                })  
         sendResponse(res, 200, "Tenant Added successfully", {saveUser,updatedInventoryData,Bookings,rentTransaction});
};

export const createAUpdateTenant = async (req, res) => {

    const fname = req.body.fname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const inventoryId = req.body.inventoryId;
    const tenantStatus= req.body.isTenant;
    const tokenAdvance = req.body.tokenAdvance;
    const moveInDate = new Date() || req.body.moveInDate;
   
    console.log('move in',moveInDate);
  //  console.log(' req body move in',req.body.moveInDate);
  
    const admin = req.user;
    const to = req.body.ownerId;

    const user = await User.findOne(
        {
          mobile: mobile,
        });
    
    const tenantUser = await RentalTenant.findOne({ user:user})

    //if user does not exist in Rental Tenant Model create a new User
    if(!tenantUser){
        const saveUserTenant = await User.create(
            {
              fname: fname,
              email: email,
              mobile: mobile,
              isProfileCompleted:true
               //   isTenant: tenantStatus,
            });
  
            const saveInTenant = await RentalTenant.create(
              {
                  user:saveUserTenant,
                  createdBy: admin,
              })

          const updatedInventoryData = await Inventory.updateOne(
            { _id: inventoryId },
            { 
              moveInDate : moveInDate,
              tokenAdvance:tokenAdvance
            })
    
            const totalBookings = await Booking.countDocuments({});
            console.log('total Inventory',totalBookings);
            let currentBookingNo = totalBookings + 1;
            const sku = `HJR${currentBookingNo}`
            console.log('SKU',sku);
      
            const inventoryDetails = await Inventory.findOne({_id : inventoryId})
            console.log('INVENTORY', inventoryDetails);
    
    
                  const Bookings = await Booking.create({
                    tenant: saveInTenant.user,     
                    bookingId: sku,
                    inventory: inventoryId,  
                    owner : inventoryDetails.user,
                    "tokenAmount.amount": tokenAdvance,
                    createdBy:admin,
                  })
  
            console.log('move In date',moveInDate)
        //   const d = moveInDate.getMonth() +1 ;
        //   console.log(d)
            const paidFromStartMonth =  moveInDate.getMonth() + 1;
            console.log('month',paidFromStartMonth);
            const paidFromStartDate =  1 ;
            const paidYear =  moveInDate.getFullYear();
            console.log(paidYear)
            //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
            const paidFrom = new Date(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`);
            const nextMonth = moveInDate.getMonth() + 2
            console.log('next month',nextMonth)
            const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`)
            console.log(paidUntil)
    
            const rentTransaction = await  RentalTransactions.create({
              from: saveInTenant.user,     
              bookingId: Bookings,
              transactionType: 'RENT',
              to : inventoryDetails.user,
              amount: inventoryDetails.rent,
              createdBy:admin,
              paidFrom: paidFrom,
              paidUntil:paidUntil,
            })
          
       sendResponse(res, 200, "Tenant Added successfully", {saveInTenant});

    }else{
        const updateUser = await User.updateOne(
            { mobile: mobile },
            {
              fname: fname,
              email: email,
              mobile: mobile,
              isProfileCompleted:true
               //   isTenant: tenantStatus,
            });
        
        const updateTenant = await RentalTenant.updateOne(
            { user: user},
            {
                user:user,
                createdBy: admin,
            })

        const prevBooking = await Booking.findOne({ tenant : user,inventory : inventoryId });
        if(!prevBooking){

            const totalBookings = await Booking.countDocuments({});
            console.log('total Inventory',totalBookings);
            let currentBookingNo = totalBookings + 1;
            const sku = `HJR${currentBookingNo}`
            console.log('SKU',sku);
      
            const inventoryDetails = await Inventory.findOne({_id : inventoryId})
            console.log('INVENTORY', inventoryDetails);


                const Bookings = await Booking.create({
                    tenant: tenantUser.user,     
                    bookingId: sku,
                    inventory: inventoryId,  
                    owner : inventoryDetails.user,
                    "tokenAmount.amount": tokenAdvance,
                    createdBy:admin,
                })

                    console.log('move In date',moveInDate)
                //   const d = moveInDate.getMonth() +1 ;
                //   console.log(d)
                    const paidFromStartMonth =  moveInDate.getMonth() + 1;
                    console.log('month',paidFromStartMonth);
                    const paidFromStartDate =  1 ;
                    const paidYear =  moveInDate.getFullYear();
                    console.log(paidYear)
                    //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
                    const paidFrom = new Date(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`);
                    const nextMonth = moveInDate.getMonth() + 2
                    console.log('next month',nextMonth)
                    const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`)
                    console.log(paidUntil)

                        const rentTransaction = await  RentalTransactions.create({
                        from: tenantUser.user,     
                        bookingId: Bookings,
                        transactionType: 'RENT',
                        to : inventoryDetails.user,
                        amount: inventoryDetails.rent,
                        createdBy:admin,
                        paidFrom: paidFrom,
                        paidUntil:paidUntil,
                        })
        
                    //sendResponse(res, 200, "Tenant Added successfully", {saveInTenant});


        }else{
            const updatedInventoryData = await Inventory.updateOne(
                { _id: inventoryId },
                { 
                  moveInDate : moveInDate,
                  tokenAdvance:tokenAdvance
                })

            const Bookings = await Booking.updateOne(
                { tenant: tenantUser.user, inventory:inventoryId},
                {         
                    "tokenAmount.amount": tokenAdvance,   
                })

            const Booking = await Booking.findOne({ tenant: tenantUser.user, inventory:inventoryId})
            console.log('move In date',moveInDate)
                //   const d = moveInDate.getMonth() +1 ;
                //   console.log(d)
            const paidFromStartMonth =  moveInDate.getMonth() + 1;
            console.log('month',paidFromStartMonth);
            const paidFromStartDate =  1 ;
            const paidYear =  moveInDate.getFullYear();
            //console.log(paidYear)
            //console.log(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`)
            const paidFrom = new Date(`${paidYear}-${paidFromStartMonth}-${paidFromStartDate}`);
            const nextMonth = moveInDate.getMonth() + 2
            console.log('next month',nextMonth)
            const paidUntil = new Date(`${paidYear}-${nextMonth}-${paidFromStartDate}`)
            console.log(paidUntil)

            const rentTransaction = await  RentalTransactions.updateOne(
                {   bookingId: Booking },
                {
                    paidFrom: paidFrom,
                    paidUntil:paidUntil,
                })
        }        
    }
    //sendResponse(res, 200, "Tenant Added successfully", {saveInTenant,updatedInventoryData,Bookings,rentTransaction});
  };


  export const getOwner = async (req, res) => {
    const mobile = req.params.mobile;
    let user = await User.findOne({mobile:mobile})
    if(user){
        let owner = await RentalOwner.findOne({user: user})
        let inventory = await Inventory.find({user:owner})
        let booking = await Booking.find({owner: owner}) 
        let transactions = await RentalTransactions.find({to:owner})
        console.log('Owner',owner);
        if(owner){
            return sendResponse(res, 200, "Owner Record Found Pls Udpate", {tenant,inventory,booking,transactions});
        }else{
            return sendResponse(res, 400, "User Does Not Exist As Owner");
        }
    }else{
        return sendResponse(res, 400, "Owner Does Not Exist");
    }   
};

export const getAdminOwners = async (req, res) => {
  const admin =req.user;
      let owner = await RentalOwner.find({ createdBy: admin }).populate('user').populate('createdBy')
      console.log('Owner',owner);
      if(owner){
          return sendResponse(res, 200, "Owner List Fetched", {owner});
      }else{
          return sendResponse(res, 400, "User Does Not Exist As Owner");
      }
};

export const getAllOwners = async (req, res) => {
  
      let owner = await RentalOwner.find({})
      console.log('Owner',owner);
      if(owner){
          return sendResponse(res, 200, "Owner List Fetched", {owner});
      }else{
          return sendResponse(res, 400, "Owners Not Found");
      }
};

  

  export const createOwner = async (req, res) => {

    const fname = req.body.fname;
    const email = req.body.email;
    const phone = req.body.mobile;
    const name = req.body.name;
    const accountNo = req.body.accountNumber;
    const ifsc = req.body.ifscCode;
    const aadharNo = req.body.aadharCardNumber;
    const panNo = req.body.panCardNumber;
    const ownerStatus = req.body.isOwner;

    const admin = req.user;
  
        const saveUser = await User.create(
          {
            fname: fname,
            email: email,
            mobile: phone,
            isProfileCompleted:true,
          });

          const createOwner = await RentalOwner.create({
            user:saveUser,
       //     aadhar:req.body.aadhar,
      //      pan:req.body.pan,
      //      cancelledCheque: req.body.cancelledCheque,
            createdBy:admin,
            aadharCardNumber:aadharNo,
            panCardNumber: panNo,
          })
      
          let userBankDetails = await Bank.create(
            { 
              user:createOwner.user,
              name:name,
              accountNumber:accountNo,
              ifscCode: ifsc,
              default:true ,
              
            }) 
  
    sendResponse(res, 200, "Owner Added successful", {owner:createOwner,userBankDetails});
  };


  export const updateOwner = async (req, res) => {

    const fname = req.body.fname;
    const email = req.body.email;
    const phone = req.body.mobile;
    const name = req.body.name;
    const accountNo = req.body.accountNumber;
    const ifsc = req.body.ifscCode;
    const aadharNo = req.body.aadharCardNumber;
    const panNo = req.body.panCardNumber;
    const ownerStatus = req.body.isOwner;
    const admin = req.user;

        const saveUser = await User.updateOne(
            { mobile:phone},
            {
                fname: fname,
                email: email,
            });
        const user = await User.find({mobile:phone})

          const updateOwner = await RentalOwner.updateOne(
            { user: user},
            {
                aadharCardNumber:aadharNo,
                panCardNumber: panNo,
            })
      
          let userBankDetails = await Bank.updateOne(
            { user: user },
            { 
              name:name,
              accountNumber:accountNo,
              ifscCode: ifsc,
              default:true ,
            }) 
  
    sendResponse(res, 200, "Owner Details Udpated Successfully",);
  };



  // Update Owner media
export const updateOwnerMedia = async (req, res, next) => {
    try {
   //   const bunnyStorage = await new BunnyStorage(process.env.BUNNYCDN_API_KEY, process.env.BUNNYCDN_STORAGE_ZONE);
   //   console.log('Req.body',req);
      let owner = await RentalOwner.findOne({user: req.params.ownerId}).lean()
      console.log("OWNER", owner);
      if(!owner){
        return sendResponse(res, 400, "Owner Does Not Exist");
      }
      let data = {
        aadhar: undefined,
        pan: undefined,
        cancelledCheque: undefined,
        //serviceAgreementUpload: undefined,
      }
      console.log('before files');
     console.log('Req Files', req.files);
     console.log('Req Files aadhar', req.files.aadhar);

    if(req.files.aadhar){
    //      console.log('Req Files aadhar', req.files.aadhar);
          const options = {
            method: 'PUT',
            url: `https://storage.bunnycdn.com/housejoy/owner/aadhars/${req.files.aadhar[0].originalname}`,
            headers: {
            'AccessKey': 'af1a5c9e-c720-4f55-b177cd11060e-86b0-47be',
            'content-type': 'multipart/form-data',
          },
          data:  fs.readFileSync(req.files.aadhar[0].path), 
        };
      //    https://storage.bunnycdn.com/$%7BstorageZoneName%7D/owner/aadhars/$%7Baadhar.value.files[0].name%7D%60
            const OwnerAdhr= await axios(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                  });   
            if(OwnerAdhr.status === 201){
              data.aadhar = `https://housejoy.b-cdn.net/owner/aadhars/${owner._id}-${req.files.aadhar[0].originalname}`
        }
    }

    if(req.files.pan){
   //   console.log('Req Files aadhar', req.files.pan);
          const options = {
            method: 'PUT',
            url: `https://storage.bunnycdn.com/housejoy/owner/pan/${req.files.pan[0].originalname}`,
            headers: {
            'AccessKey': 'af1a5c9e-c720-4f55-b177cd11060e-86b0-47be',
            'content-type': 'multipart/form-data',
          },
          data:  fs.readFileSync(req.files.pan[0].path), 
        };
  //    https://storage.bunnycdn.com/$%7BstorageZoneName%7D/owner/aadhars/$%7Baadhar.value.files[0].name%7D%60
        const OwnerPan= await axios(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
              });   
       // console.log('response cdn',responseCDN);
        if(OwnerPan.status === 201){
          data.pan = `https://housejoy.b-cdn.net/owner/pan/${owner._id}-${req.files.pan[0].originalname}`
    }
}

if(req.files.cancelledCheque){
        //   console.log('Req Files aadhar', req.files.pan);
          const options = {
            method: 'PUT',
            url: `https://storage.bunnycdn.com/housejoy/owner/cancelledCheque/${req.files.cancelledCheque[0].originalname}`,
            headers: {
            'AccessKey': 'af1a5c9e-c720-4f55-b177cd11060e-86b0-47be',
            'content-type': 'multipart/form-data',
          },
          data:  fs.readFileSync(req.files.cancelledCheque[0].path), 
        };
 //    https://storage.bunnycdn.com/$%7BstorageZoneName%7D/owner/aadhars/$%7Baadhar.value.files[0].name%7D%60
            const OwnerCancelledCheque= await axios(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                  });   
    //   console.log('response cdn',responseCDN);

            if(OwnerCancelledCheque.status === 201){
              data.cancelledCheque = `https://housejoy.b-cdn.net/owner/cancelledCheque/${owner._id}-${req.files.cancelledCheque[0].originalname}`
        }
} 
      // Update in database
      await RentalOwner.updateOne({ _id: owner._id }, {
        $set: data
      })
  
      res.json({
        result: 'success'
      })
  
    } catch (err) {
      next(err)
    }
  }


  export const saveInventory = async (req, res) => {

    const userId = req.params.ownerId;
    const propertyName = req.body.propertyName;
    const address= req.body.address;
    const floor= req.body.floor;
    const door= req.body.door;
    const bhk= req.body.bhk;
    const carpetArea= req.body.carpetArea;
    const geolocation= req.body.geolocation;
    const rent=req.body.rent;
    const securityDeposit= req.body.securityDeposit;
    const adminData = req.user;
  
  
  
    const totalInventory = await Inventory.countDocuments({});
    console.log('total Inventory',totalInventory);
    let currentPropertyNo = totalInventory + 1;
    const sku = `HJR${currentPropertyNo}`
    console.log('SKU',sku);
  
          const createInventory = await Inventory.create({
            inventoryId: sku,
            user:userId,
            propertyName: req.body.propertyName,
            address: req.body.address,
            floor: req.body.floor,
            bhk:req.body.bhk,
            door:req.body.door,
            carpetArea: req.body.carpetArea,
            geolocation: req.body.geolocation,
            rent:req.body.rent,
            securityDeposit: req.body.securityDeposit,
            createdBy:adminData._id,
  
        })
  
    sendResponse(res, 200, "Inventory Saved Successful", {createInventory});
  };

  //GET Inventory Details
export const getInventoryDetails = async (req, res) => {
  const userId = req.user;
       let allInventories = await Inventory.find({ createdBy :userId });
       return sendResponse(res, 200, "Inventories Fetched Successfully", { allInventories });
};

//GET Inventory Details With Inventory ID
export const getInventorywithId = async (req, res) => {
  const userId = req.user;
       let inventory = await Inventory.find({ inventoryId : req.params.inventoryId });
       return sendResponse(res, 200, "Inventory Data Fetched Successfully", { inventory });
};


//GET Inventory Details
export const getAllInventoryDetails = async (req, res) => {
  const userId = req.user;
       let allInventoriesData = await Inventory.find({});
       return sendResponse(res, 200, "All Inventories Fetched Successfully", { allInventoriesData });
};


//GET Owner Inventory With Mobile No
export const getOwnerInventory = async (req, res) => {
  const userId = req.user;
  let user = await User.findOne({ mobile: req.params.mobile });

       let allInventoriesData = await Inventory.find({ user:user });
       return sendResponse(res, 200, "All Owner Inventories Fetched Successfully", { allInventoriesData });
};

//GET Inventory Details
export const getAllBookings = async (req, res) => {
  const userId = req.user;
       let allBookings = await Booking.find({ createdBy :userId });
       return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
};


//GET Inventory Details WRT ADMIN
export const getBookingDetails = async (req, res) => {
  let allBookings = await Booking.find({ bookingId : req.params.bookingId }).populate('inventory').populate('owner').populate('tenant');
  return sendResponse(res, 200, "Bookings Fetched Successfully", { allBookings });
};



//GET All Tenants
export const getAllTenants = async (req, res) => {
  console.log('inside get all tenant');
       let allTenants = await RentalTenant.find({ });
       return sendResponse(res, 200, "All Tenants Fetched Successfully", { allTenants });
};

//GET All Tenants
export const getAllowners = async (req, res) => {
  console.log('inside get all tenant');
       let allOwners = await RentalOwner.find({ });
       return sendResponse(res, 200, "All Owners Fetched Successfully", { allOwners });
};