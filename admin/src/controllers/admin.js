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
import { uploadToBunnyCdn } from "../../../shared/utils/bunnycdn.js";
import  fs  from  "fs";
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
            isTenant: tenantStatus,
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
  
  
                const Bookings = await Booking.create({
                  tenant: saveUser._id,     
                  bookingId: sku,
                  inventory: inventoryId,  
                  owner : inventoryDetails.user,
                  createdBy:admin,
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
    sendResponse(res, 200, "Tenant Added successfully", {saveUser,createUserAsTenant,updatedInventoryData,Bookings,rentTransaction});

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
export const updateMedia = async (req, res, next) => {
    try {
      console.log('Req.body',req);
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
      
    console.log('req files', req.files);
    console.log('req file', req.file);
      console.log('req files :',req.files.aadhar);
  
      // Upload owner Aadhar to CDN
      if(req.files.aadhar){
        await bunnycdn.upload({
          fileData: fs.readFileSync(req.files.aadhar[0].path),
          savingPath: `/owner/aadhars/${owner._id}-${req.files.aadhar[0].originalname}`
        })
        fs.unlinkSync(req.files.aadhar[0].path)
        data.aadhar = `${process.env.CDN_URL}/owner/aadhars/${vendor._id}-${req.files.aadhar[0].originalname}`
      }

      // Upload owner Pan to CDN
      if(req.files.pan){
        await bunnycdn.upload({
          fileData: fs.readFileSync(req.files.pan[0].path),
          savingPath: `/owner/pans/${owner._id}-${req.files.pan[0].originalname}`
          })
          fs.unlinkSync(req.files.pan[0].path)
          data.pan = `${process.env.CDN_URL}/owner/pans/${owner._id}-${req.files.pan[0].originalname}`
        }
  
      // Upload bankDocument to CDN
      if(req.files.cancelledCheque){
        await bunnycdn.upload({
          fileData: fs.readFileSync(req.files.cancelledCheque[0].path),
          savingPath: `/owner/cancelledCheques/${owner._id}-${req.files.cancelledCheque[0].originalname}`
        })
        fs.unlinkSync(req.files.bankDocument[0].path)
        data.cancelledCheque = `${process.env.CDN_URL}/owner/cancelledCheques/${owner._id}-${req.files.cancelledCheque[0].originalname}`
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