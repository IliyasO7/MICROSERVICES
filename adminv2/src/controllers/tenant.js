import User from "../../../shared/models/user.js";
import RentalTenant from "../../../shared/models/rentalTental.js";
import Inventory from "../../../shared/models/inventory.js";
import Booking from "../../../shared/models/Booking.js";
import RentalTransactions from "../../../shared/models/rentalTransactions.js";
import RentalOwner from "../../../shared/models/rentalOwner.js";



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


//GET ADMIN TENANTS
export const getAdminTenants = async (req, res) => {
    const userId = req.user;
         let tenants =  await RentalTenant.find({createdBy:userId }).populate('user').populate('createdBy')
         return sendResponse(res, 200, "Inventories Fetched Successfully", { tenants });
};

//GET ALL TENANTS
export const getAllTenants = async (req, res) => {
         let tenants =  await RentalTenant.find({})
         return sendResponse(res, 200, "Inventories Fetched Successfully", { tenants });
};