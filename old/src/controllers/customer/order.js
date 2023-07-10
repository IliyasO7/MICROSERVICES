const crypto = require("crypto")
const mongoose = require('mongoose')
const axios = require('axios')
const randomstring = require('randomstring')
const razorpay = require('razorpay')
const dayjs = require('dayjs')
const PhoneNumber = require('awesome-phonenumber')
const _ = require('lodash')
const COUPON_CODE = "BFREE100";
const firebaseService = require('../../services/firebase')
// Models
const Order = require('../../models/order')
const Service = require('../../models/service')
const Customer = require('../../models/customer')
const Bucket = require('../../models/bucket')

// Services
const orderService = require('../../services/order')
const customerService = require('../../services/customers')
const smsService = require('../../services/sms')
const Vendor = require("../../models/vendor")
const { log } = require("console")

// List orders
exports.list = async (req, res, next) => {
  try {

    let orders = await Order.find({ customer: req.userData.customerId } ).populate('service', 'name slug').lean()
    
    res.status(200).json({
      result: 'success',
      count: orders.length,
      orders: orders
    })

  } catch (err) {
    next()
  }
}

// Order details
exports.details = async (req, res, next) => {
  try {

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('service', 'name slug category').populate('vendor', 'ownerName businessName phone').lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    // Create Payu Hash
    let payuHash = await crypto.createHash('sha512').update(`vUMBUP|${order.orderId}|${order.payment.amount}|${order.service.name} - ${order.orderId}|${order.customer.fname}|${order.customer.email}|||||||||||F8UGBZLybl3jP3BUbZOY4Sn9ZIleRPxO`).digest('hex')

    res.status(200).json({
      result: 'success',
      order: order,
      payuHash: payuHash
    })

  } catch (err) {
    next(err)
  }
}




// Verify Coupo
exports.coupon = async (req, res, next) => {
  try {
    console.log('userData:',req.userData.customerId);
    console.log('Order ID:',req.params.orderId);
    console.log('coupon',req.body.couponCode);
    console.log('************************');

    let customerData = await Customer.findOne({_id: req.userData.customerId})

    console.log('customer-Data :',customerData);
    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('service', 'name slug category').populate('vendor', 'ownerName businessName phone').lean()
    console.log("ORDER DETAILS", order);
    console.log("SERVICE :", order.service.name);

    if(customerData.couponCODEB_COUNT === 0)
    {

          if(order.service.name === "Bathroom Cleaning")
          {
            console.log('true');
            if(req.body.couponCode === COUPON_CODE)
            {

              let customerUpdate = await Customer.updateOne({_id: req.userData.customerId},
                {couponCODEB_COUNT:1})

                console.log('updated cout',customerUpdate);
                console.log('coupon MATCH SUCCESS');

                return  res.status(200).json({
                result: 'success',
                message:'100% off',
                order:order
              })
            }
            else{
              return  res.status(500).json({
                result: 'Failed',
                message:'Invalid COUPON CODE',
              
              })
            }
          }
          else{
            return  res.status(500).json({
              result: 'Operation-Failed',
              message:'Invalid COUPON SERVICE',
            })
          }
    }
    else{
      return  res.status(500).json({
        result: 'Operation-Failed',
        message:'COUPON HAS ALREADY BEEN USED',
      })

    }


  } catch (err) {
    next(err)
  }
}

// Create order
exports.create = async (req, res, next) => {
  try {

    // Get customer
    let customer = await Customer.findOne({ _id: req.userData.customerId }).lean()
    if(!customer){
      throw new Error('Customer not found')
    }

    // Service
    let service = await Service.findOne({ _id: req.body.serviceId }).lean()
    if(!service){
      throw new Error('Service not found')
    }

    let order = {
      orderId: undefined,
      isFinal: req.body.isFinal,
      service: {
        name: service.name,
        category: service.category,
        slug: service.slug,
        subLines: []
      },
      amount: {
        subtotal: 0,
        taxes: [],
        total: 0
      }
    }

    // Check if all filters are supplied
    let suppliedFilters = _.map(req.body.filters, 'filterId')
    for(var filter of service.filters){
      if(!_.includes(suppliedFilters, _.toString(filter._id))){
        throw new Error(`Filter value for "${filter.title}" is not supplied`)
      }
    }

    // Calculate subtotal prices
    order.amount.subtotal += service.price 

    // Add filters price to subtotal
    for(var o of req.body.filters){

      let filter = _.find(service.filters, (i) => { return i._id == o.filterId })
      let option = _.find(filter.options, (i) => { return i._id == o.optionId })

      order.service.subLines.push(`${filter.title}: ${option.value}`)

      order.amount.subtotal += option.price

    }

    // Calculate total price
    order.amount.total = order.amount.subtotal + _.sumBy(order.amount.taxes, 'amount')

    // If order is final
    if(req.body.isFinal){

      let orderId = _.toUpper(randomstring.generate(7))

      const totalOrders = await Order.countDocuments({});
      console.log('total Inventory',totalOrders);
      let currentOrderNo = totalOrders + 1;
      let orderNo = `HJ-ODS-${currentOrderNo}`;
      console.log('Order Sku',orderNo);

      
      let now = new Date();
      now = new Date(now.getTime() + 330*60000);
      let nowStr = now.toString();
      let nowDate = nowStr.substring(0, 15);
      let nowTime = nowStr.substring(16, 24)
      await new Order({
        _id: mongoose.Types.ObjectId(),
        orderId: orderId,
        orderNo:orderNo,
        customer: req.userData.customerId,
        service: service._id,
        address: req.body.address,
        taxes: order.amount.taxes,
        'payment.amount': order.amount.total,
        serviceDate: req.body.serviceDate,
        serviceTime: req.body.serviceTime,
        filters: order.service.subLines.length > 0 ? _.join(order.service.subLines, '\n') : null,
      }).save()

      order.orderId = orderId
      order.orderNo = orderNo

      
      
      // Send SMS
      await smsService.send({
        type: 'TXN',
        senderId: 'HSEJOY',
        templateId: '1107167223418440431',
        phone: customer.phone,
        message: `Thank you for using HouseJoy Service! Your booking ID: ${orderId} is confirmed on ${nowDate}, ${nowTime}. Our professional partner will get back to you shortly.`
      })

    }

    res.json({
      result: 'success',
      order: order
    })

  } catch (err) {
    next(err)
  }
}

// Delete order
exports.delete = async (req, res, next) => {
  try {

    await Order.deleteOne({ orderId: req.params.orderId })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Cancel Order
exports.cancel = async (req, res, next) => {
  try {

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    await Order.updateOne({ orderId: req.params.orderId }, {
      $set: {
        "status": "Cancelled",
        "cancellationReason": req.body.reason
      } 
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903365507452',
      phone: order.customer.phone,
      message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903561597572',
      phone: order.vendor.phone,
      message: `Housejoy: We are sorry to inform you that your upcoming service with Booking ID: ${order.orderId} got cancelled by the customer. We will let you know if there is a change in the plan! -Sarvaloka Services On Call Pvt Ltd`
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

exports.feedback = async (req, res, next) => {
  try {
    console.log(`feedback given for orderId: ${req.params.orderId}`)

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()

      if (!order) {
        throw {
          status: 404,
          message: 'Order not found'
        }
      }

      await Order.updateMany({ orderId: req.params.orderId }, {
        $set: {
          "rating.service": req.body.service,
          "rating.behaviour": req.body.behaviour,
          "rating.cleaning": req.body.cleaning,
          "rating.feedback": req.body.feedback
        } 
      })

      // // Send SMS
      // await smsService.send({
      //   type: 'TXN',
      //   senderId: 'HSEJOY',
      //   templateId: '1107167903365507452',
      //   phone: order.customer.phone,
      //   message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
      // })
  
      res.status(200).json({
        result: 'success'
      })
  } catch (err) {
    console.log(err)
    next(err)
  }
}


exports.vendorFilter = async (req, response, next) => {
  try {
    console.log(`orderId is: ${req.params.orderId}`)

    let order = await Order.findOne({ orderId: req.params.orderId }).populate('customer').populate('service').lean()
      if (!order) {
        throw {
          status: 404,
          message: 'Order not found'
        }
      }
      console.log('order',order);
      console.log('order city of customer',order.customer.addresses); 
      console.log('order service name',order.service.name); 
      let orderService =order.service;
      console.log('orderService', order.service);
      if(order.customer.addresses){
        var customerCity = order.customer.addresses;
      }
      console.log(customerCity);

      if(order.service.name){
        var orderServiceName = order.service.name;
      }


      const allvendors = await Vendor.find({}).lean()

      console.log('all vendors', allvendors);
      console.log('total Vendors',allvendors.length);
    /*  if(vendor.serviceProvided.includes(order.service)){
        console.log('yes');
      }*/
      
      const firstVendorFilter = [];
      var flag =false;
      var increment = 1;
      //basic Filter
      for await (eachVendor of allvendors){
        console.log('customer city is',customerCity[0].city);
        console.log('Each Vendor city is :', eachVendor.serviceArea.city);
        if(eachVendor.status == 'Active'){
          if(eachVendor.serviceArea.city === customerCity[0].city){
            console.log('Service provided by vendor',eachVendor.serviceProvided);
            
            console.log('EACH', eachVendor);
            
            for(var i=0;i<eachVendor.serviceProvided.length;i++){
              if(order.service._id == eachVendor.serviceProvided[i]){
                console.log('FLAG CHANGE TO TRUE BECAUSE SERVICE MATCHES WITH ORDER SERVICE');
                flag=true;
              }
            }
            console.log('FLAG', flag);
            if(flag){
              console.log('inside service provided true');
              if(eachVendor.availability){
                console.log('vendor availability increment is ',increment);
                ++increment;
                firstVendorFilter.push(eachVendor)
              }         
            }
          }
        }
      }
      console.log('First Filter',firstVendorFilter);
      console.log('total Vendors',allvendors.length);
      console.log('Filtered length',firstVendorFilter.length);

      //based on fullfillment Ratio
      const fullfillmentVendorFilter = firstVendorFilter.sort((a,b)=>b.fullfillment_ratio - a.fullfillment_ratio)
      console.log('sorted vendors based on Max fullfillment ratio', fullfillmentVendorFilter);

      //based on rating
      const ratingVendorFilter = fullfillmentVendorFilter.sort((a,b)=> b.rating - a.rating);
      console.log('sorted vendors based on Max Rating', ratingVendorFilter);

      //based on acceptance Ratio Final sorted list of vendors
      const acceptanceVendorFilter = ratingVendorFilter.sort((a,b)=> b.acceptance_ratio - a.acceptance_ratio)
      console.log('sorted vendors based on Max Acceptance ratio', acceptanceVendorFilter);
      console.log('first sorted vendor to whom this order will be assigned ', acceptanceVendorFilter[0]);

      console.log('before response time', new Date().getTime());
      console.log('ORDER', order);
 

      /*
      //Assigning To ALL  Vendors who has the potential
      let bId = _.toUpper(randomstring.generate(7))
      for(var i=0; i<acceptanceVendorFilter.length;i++){
        console.log(`${i}`,acceptanceVendorFilter[i]);

        await new Bucket({
          _id: mongoose.Types.ObjectId(),
          bucketId:bId,
          order:order,
          vendor:acceptanceVendorFilter[i],

        }).save()

      }   
      */

      /*  BUCKET VISULISATION
      Bucketid    vendor   order   assigned    VendorJobStatus  
       1             1      1        false       PENDING
       2             2      1        false       PENDING
       3             3      1        false       PENDING
      */

      //FIRST FUNCTION TO ASSIGN VENDOR TO JOB


      function firstJobfirstVendor(){
                console.log('ASSIGNING...') 
                //PROMISE REGISTERED TO GET INTO NEXT FUNCTION IF STATUS IN PENDING 
                return new Promise((res,rej) => {
           const myTimeout = setTimeout(()=>{
                      console.log('set Timeout')
                      
                        res('Assign New Vendor')
                    },300000);  // 300000 5 min timer

            //FUNCTION DEFINATION OF ASSIGNING VENDOR TO JOB
            function assignFirstVendor(){
              console.log('hi assigning 1st vendor')
              var timeVendorAssignment = new Date(Date.now() + (6 * 45 * 1000)); //4 min 30 seconds
                  var status;
                  //FUCNTION TO CHECK THE STATUS OF THE VENDOR [ACCEPTED,REJECTED,PENDING]
                   async function checkStatus(){
                    console.log('Checking status of vendor')

                    console.log('ORDER', order);
                    console.log('FIRST RANKED VENDOR :',acceptanceVendorFilter[0] );

                    //CHECK STATUS OF VENDOR AND JOB IN BUCKET
                    var preStatus = await Bucket.findOne({order: order,vendor:acceptanceVendorFilter[0]})
                    console.log('pre status',preStatus);

                    //ASSIGNING BUCKET STATUS TO STATUS
                     status = preStatus.vendorJobStatus
                    console.log('STATUS IS:', status);
                    console.log('pre status  is assigned:', preStatus.assigned);
                    if(preStatus.assigned === false){
                      console.log('false');                 
                      }

                    //IF STATUS IS PENDING AND ASSIGNED IS FALSE ASSIGN THE JOB TO VENDOR
                    if(status === 'PENDING' && preStatus.assigned === false){
                      console.log('ASSIGNING TO 1 st Vendor');

                      //UPDATE ASSIGNED TO TRUE  SEND NOTIFICATION AND SMS
                      var preStatus = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[0]},{assigned:true})
                      var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[0].vendorId },{threshold:true})
                                // Send notification to vendor 
                                console.log('fcm token',acceptanceVendorFilter[0].fcmToken);
                           
                           const fcmSendToken = await firebaseService.sendNotification({
                                  registrationToken: acceptanceVendorFilter[0].fcmToken,
                                  title: 'New Order Assigned',
                                  body: `New order with Order-ID ${order.orderId} has been assigned to you.`
                                })
                           console.log('sent...',fcmSendToken);

                                // Send SMS
                                await smsService.send({
                                  type: 'TXN',
                                  senderId: 'HSEJOY',
                                  templateId: '1107167903318015766',
                                  phone: acceptanceVendorFilter[0].phone,
                                  message: `Hi  ${acceptanceVendorFilter[0].ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
                                })  
                    } //remove after bucket save
                     //IF VENDOR ACCEPTS THE JOB SEND VENDOR AS ASSIGNED 
                    //remove after bucket save
                    else if(status === 'ACCEPTED'){
                      console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER')
                      var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[0].vendorId },{threshold:false})

                  
                    /*  console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER');
                         const result= await Order.updateOne({ orderId: order.orderId }, {
                          vendor:acceptanceVendorFilter[0]
                      })    */

            
                      return response.json({message:"VENDOR HAS BEEN ASSIGNED"})
                      //return res.status(200).json({message:"VENDOR HAS BEEN ASSIGNED", data:result})
                    }   
                }
               // checkStatus();
                var myInterval = setInterval(async()=>{
                  if(status === 'PENDING' ){
                   
                    const nowTime = new Date()
                    console.log('now time',nowTime);
                    console.log('time vendor assignment',timeVendorAssignment);
                    if(nowTime > timeVendorAssignment ){ //assign logic
                      console.log('Interval status is PENDING');
                   //   clearTimeout(myTimeout);
                      return clearInterval(myInterval);
                    }
                  }
                  if(status === 'ACCEPTED'){
                    console.log('ACCEPTED')
                    clearTimeout(myTimeout);
                    return clearInterval(myInterval);
                  } 
                  
                  if(status === 'REJECTED'){
                    var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[0].vendorId },{threshold:false})
                      console.log('REJECTED')
                      clearTimeout(myTimeout);//NEWLY ASSIGNED YET TO BE CHECKED
                      clearInterval(myInterval);
                      return res('Assign New Vendor')
                   // return clearInterval(myInterval);
                  }  
                     checkStatus();
                    console.log('hello setInterval')  
                },10000) // 100000
            }
                    assignFirstVendor()   
                })
      }


      function secondJobSecondVendor(data){
        console.log('inside second vendor');
        //NOTE : IN FUTURE REMOVE BUCKET DATA OF VENDOR AND ORDER AND USE IT FOR SEAMLESSNESS
        console.log(data);


        console.log('ASSIGNING...') 
        //PROMISE REGISTERED TO GET INTO NEXT FUNCTION IF STATUS IN PENDING 
        return new Promise((res,rej) => {
   const secondMyTimeout = setTimeout(()=>{
              console.log('set Timeout')
              
                res('Assign New Vendor')
            },300000);  // 300000 5 min timer

    //FUNCTION DEFINATION OF ASSIGNING VENDOR TO JOB
    function assignSecondVendor(){
      console.log('hi assigning 2nd vendor')
      var secondtimeVendorAssignment = new Date(Date.now() + (6 * 45 * 1000)); //4 min 30 seconds
          var secondvendorstatus;
          //FUCNTION TO CHECK THE STATUS OF THE VENDOR [ACCEPTED,REJECTED,PENDING]
           async function checkStatus(){
            console.log('Checking status of 2nd vendor')

            console.log('ORDER', order);
            console.log('SECOND RANKED VENDOR :',acceptanceVendorFilter[1] );

            //CHECK STATUS OF VENDOR AND JOB IN BUCKET
            var secondpreStatus = await Bucket.findOne({order: order,vendor:acceptanceVendorFilter[1]})
            console.log('pre status',secondpreStatus);

            //ASSIGNING BUCKET STATUS TO STATUS
             secondvendorstatus = secondpreStatus.vendorJobStatus
            console.log('2 STATUS IS:', secondvendorstatus);
            console.log('2 pre status  is assigned :', secondpreStatus.assigned);
            if(secondpreStatus.assigned === false){
              console.log('false');                 
              }

            //IF STATUS IS PENDING AND ASSIGNED IS FALSE ASSIGN THE JOB TO VENDOR
            if(secondvendorstatus === 'PENDING' && secondpreStatus.assigned === false){
              console.log('ASSIGNING TO 2nd Vendor');

              //UPDATE ASSIGNED TO TRUE  SEND NOTIFICATION AND SMS
              var secondpreStatus = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[1]},{assigned:true})
              const updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[1].vendorId },{threshold:true})

           //   await 
             
                        // Send notification to vendor 
                          /*  
                        await firebaseService.sendNotification({
                          registrationToken: acceptanceVendorFilter[1].fcmToken,
                          title: 'New Order Assigned',
                          body: `New order with Order-ID ${order.orderId} has been assigned to you.`
                        })

                        // Send SMS
                        await smsService.send({
                          type: 'TXN',
                          senderId: 'HSEJOY',
                          templateId: '1107167903318015766',
                          phone: vendor.phone,
                          message: `Hi  ${acceptanceVendorFilter[1].ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
                        })  */  
            } //remove after bucket save
             //IF VENDOR ACCEPTS THE JOB SEND VENDOR AS ASSIGNED 
            //remove after bucket save
            else if(secondvendorstatus === 'ACCEPTED'){
              console.log('SECOND VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER')
              var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[2].vendorId },{threshold:false})
            /*  console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER');
                 const result= await Order.updateOne({ orderId: order.orderId }, {
                  vendor:acceptanceVendorFilter[0]
              })    */

    
              return response.json({message:"SECOND VENDOR HAS BEEN ASSIGNED"})
              //return res.status(200).json({message:"VENDOR HAS BEEN ASSIGNED", data:result})
            }   
        }
       // checkStatus();
        var secondmyInterval = setInterval(async()=>{
          if(secondvendorstatus === 'PENDING' ){
           
            const secondnowTime = new Date()
            console.log('now time',secondnowTime);
            console.log('time vendor assignment',secondtimeVendorAssignment);
            if(secondnowTime > secondtimeVendorAssignment ){ //assign logic
              console.log('second Interval status is PENDING');
           //   clearTimeout(myTimeout);
              return clearInterval(secondmyInterval);
            }
          }
          if(secondvendorstatus === 'ACCEPTED'){
            console.log('ACCEPTED')
            clearTimeout(secondMyTimeout);
            return clearInterval(secondmyInterval);
          } 
          
          if(secondvendorstatus === 'REJECTED'){
              console.log('REJECTED')
              clearTimeout(secondMyTimeout);
              clearInterval(secondmyInterval);
              return res('Assign New Vendor')
           // return clearInterval(myInterval);
          }  
             checkStatus();
            console.log('hello second  setInterval')  
        },10000) // 100000
    }
            assignSecondVendor();   
        })

      }

      //3RD FUNCTION
     function thirdJobThirdVendor(data){

      console.log('inside Third vendor');
      //NOTE : IN FUTURE REMOVE BUCKET DATA OF VENDOR AND ORDER AND USE IT FOR SEAMLESSNESS
      console.log(data);


      console.log('ASSIGNING 3rd Vendor...') 
      //PROMISE REGISTERED TO GET INTO NEXT FUNCTION IF STATUS IN PENDING 
      return new Promise((res,rej) => {
 const thirdMyTimeout = setTimeout(()=>{
            console.log('set Timeout')
            
              res('Assign New Vendor')
          },300000);  // 300000 5 min timer

  //FUNCTION DEFINATION OF ASSIGNING VENDOR TO JOB
  function assignThirdVendor(){
    console.log('hi assigning 3rd vendor')
    var thirdtimeVendorAssignment = new Date(Date.now() + (6 * 45 * 1000)); //4 min 30 seconds
        var thirdvendorstatus;
        //FUCNTION TO CHECK THE STATUS OF THE VENDOR [ACCEPTED,REJECTED,PENDING,'AUTOREJECTED']
         async function checkStatus(){
          console.log('Checking status of 3rd vendor')

          console.log('ORDER', order);
          console.log('THIRD RANKED VENDOR :',acceptanceVendorFilter[2] );

          //CHECK STATUS OF VENDOR AND JOB IN BUCKET
          var thirdpreStatus = await Bucket.findOne({order: order,vendor:acceptanceVendorFilter[2]})
          console.log('pre status',thirdpreStatus);

          //ASSIGNING BUCKET STATUS TO STATUS
           thirdvendorstatus = thirdpreStatus.vendorJobStatus
          console.log('3RD STATUS IS:', thirdvendorstatus);
          console.log('3RD pre status  is assigned :', thirdpreStatus.assigned);
          if(thirdpreStatus.assigned === false){
            console.log('false');                 
            }

          //IF STATUS IS PENDING AND ASSIGNED IS FALSE ASSIGN THE JOB TO VENDOR
          if(thirdvendorstatus === 'PENDING' && thirdpreStatus.assigned === false){
            console.log('ASSIGNING TO 3rd Vendor');

            //UPDATE ASSIGNED TO TRUE  SEND NOTIFICATION AND SMS
            var thirdpreStatus = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[2]},{assigned:true})
           
                      // Send notification to vendor 
                        /*  
                      await firebaseService.sendNotification({
                        registrationToken: acceptanceVendorFilter[2].fcmToken,
                        title: 'New Order Assigned',
                        body: `New order with Order-ID ${order.orderId} has been assigned to you.`
                      })

                      // Send SMS
                      await smsService.send({
                        type: 'TXN',
                        senderId: 'HSEJOY',
                        templateId: '1107167903318015766',
                        phone: vendor.phone,
                        message: `Hi  ${acceptanceVendorFilter[2].ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
                      })  */  
          } 
           //IF VENDOR ACCEPTS THE JOB SEND VENDOR AS ASSIGNED 
          //remove after bucket save
          else if(thirdvendorstatus === 'ACCEPTED'){
            console.log('THIRD VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER')
            var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[2].vendorId },{threshold:false})
          /*  console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER');
               const result= await Order.updateOne({ orderId: order.orderId }, {
                vendor:acceptanceVendorFilter[2]
            })    */

  
            return response.json({message:"THIRD VENDOR HAS BEEN ASSIGNED"})
            //return res.status(200).json({message:"VENDOR HAS BEEN ASSIGNED", data:result})
          }   
      }
     // checkStatus();
      var thirdmyInterval = setInterval(async()=>{
        if(thirdvendorstatus === 'PENDING' ){   
         
          const thirdnowTime = new Date()
          console.log('now time', thirdnowTime);
          console.log('time vendor assignment',thirdtimeVendorAssignment);
          if(thirdnowTime > thirdtimeVendorAssignment ){ //assign logic
            console.log('third Interval status is PENDING'); 
         //   clearTimeout(myTimeout);
            return clearInterval(thirdmyInterval);
          }
        }
        if(thirdvendorstatus === 'ACCEPTED'){
          console.log('ACCEPTED')
          clearTimeout(thirdMyTimeout);
          return clearInterval(thirdmyInterval);
        } 
        
        if(thirdvendorstatus === 'REJECTED'){
            console.log('REJECTED')
            clearTimeout(thirdMyTimeout); //newly added yet to be checked
            clearInterval(thirdmyInterval);
            return res('Assign New Vendor')
         // return clearInterval(myInterval);
        }  
           checkStatus();
          console.log('hello third  setInterval')  
      },10000) // 100000
  }
          assignThirdVendor();   
      })


}


      //Assign to rest all vendors
      function assignToRestVendors(data){
        console.log('assign to rest bucket data', data);

        console.log('ASSIGNING TO REST ALL VENDORS...') 
        //PROMISE REGISTERED TO GET INTO NEXT FUNCTION IF STATUS IN PENDING 
        return new Promise((res,rej) => {
   const myTimeout = setTimeout(()=>{
              console.log('set Timeout')
              
                res('Assign New Vendor')
            },300000);  // 300000 5 min timer

    //FUNCTION DEFINATION OF ASSIGNING VENDOR TO JOB
  async  function assigntoAllVendors(){
      console.log('hi assigning to all vendors')
      var timeVendorAssignment = new Date(Date.now() + (6 * 45 * 1000)); //4 min 30 seconds
          var newstatus;
          //ASSIGN TO ALL VENDORS
          for(var i=3;i<acceptanceVendorFilter.length;i++){

            console.log('ASSIGNING TO 3rd Vendor');

            //UPDATE ASSIGNED TO TRUE  SEND NOTIFICATION AND SMS
            var eachVendorpreStatus = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[i]},{assigned:true})
           
                      // Send notification to vendor 
                        /*  
                      await firebaseService.sendNotification({
                        registrationToken: acceptanceVendorFilter[i].fcmToken,
                        title: 'New Order Assigned',
                        body: `New order with Order-ID ${order.orderId} has been assigned to you.`
                      })

                      // Send SMS
                      await smsService.send({
                        type: 'TXN',
                        senderId: 'HSEJOY',
                        templateId: '1107167903318015766',
                        phone: vendor.phone,
                        message: `Hi  ${acceptanceVendorFilter[i].ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
                      })  */
              var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[i].vendorId },{threshold:true})
          }

          //FUCNTION TO CHECK THE STATUS OF THE BUCKET STATUS[OPEN,CLOSE]
          
           async function checkStatus(){
            console.log('Checking status of all vendor accepted/rejected/pending')

            console.log('ORDER DETAILS', order);
            

            //CHECK STATUS OF VENDOR AND JOB IN BUCKET
            var newpreStatus = await Bucket.findOne({order: order,bucketStatus:'CLOSED'})
            if(!newpreStatus){
              console.log('No one Accepted the order yet');
              newstatus='OPEN'
            }else{
              console.log('Bucket status has been changed');
              console.log('pre status  is assigned:', newpreStatus);
              newstatus = newpreStatus.bucketStatus
            }

            //ASSIGNING BUCKET STATUS TO STATUS
          
            if(!newstatus){
              console.log('No status');
            }else{
             
              console.log('STATUS IS:', newstatus);
            }
  

            //IF STATUS IS OPEN/CLOSED
            if(newstatus === 'OPEN'){
              console.log('BUCKET STATUS IS STILL OPEN...');
            }
            else if(newstatus === 'CLOSED'){
              console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER')
              console.log('ACCEPTED BUCKET status',newpreStatus);

              var updateThreshold = await Vendor.updateOne({vendorId:newpreStatus.vendor },{threshold:false})

          
            /*  console.log('VENDOR IS BEING AUTOMATICALLY ASSIGNED TO THIS ORDER');
                 const result= await Order.updateOne({ orderId: order.orderId }, {
                  vendor:preStatus.vendor
              })    */

    
              return response.json({message:"VENDOR HAS BEEN ASSIGNED"})
              //return res.status(200).json({message:"VENDOR HAS BEEN ASSIGNED", data:result})
            }   
        }
       // checkStatus();
        var myInterval = setInterval(async(newpreStatus)=>{
          if(newstatus === 'OPEN' ){
            console.log('TIME INTERVAL OPEN');
      
            const nowTime = new Date()
            console.log('now time',nowTime);
            console.log('time vendor assignment',timeVendorAssignment);
            if(nowTime > timeVendorAssignment ){ //assign logic
              console.log('Interval status is PENDING');
           //   clearTimeout(myTimeout);
              clearTimeout(myTimeout);//NEWLY ASSIGNED YET TO BE CHECKED
              clearInterval(myInterval);
              return res('Assign New Vendor')
             // return clearInterval(myInterval);
            }
          }
          if(newstatus === 'CLOSED'){
            console.log('bucket closed someone ACCEPTED the booking')
          //  console.log('vendor', newpreStatus.vendor);
           clearTimeout(myTimeout);
           clearInterval(myInterval);
        
         // return response.json({message:"A VENDOR WOULD BE ASSIGNED SHORTLY, HAVE PATIENCE"})
          } 
          
        /*  if(status === 'REJECTED'){
            var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[0].vendorId },{threshold:false})
              console.log('REJECTED')
              clearTimeout(myTimeout);//NEWLY ASSIGNED YET TO BE CHECKED
              clearInterval(myInterval);
              return res('Assign New Vendor')
           // return clearInterval(myInterval);
          }  */
             checkStatus();
            console.log('hello setInterval')  
        },10000) // 100000
    }
            assigntoAllVendors()   
        })

        

      }



        //fucntion firstjobInvoke
        firstJobfirstVendor().then(async(msg)=>{
          var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[0].vendorId },{threshold:false})
          console.log('is it');
          console.log(msg)
          const autoReject = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[0]},{vendorJobStatus:'AUTOREJECTED'})
          const bucket = await Bucket.find({order:order})
          console.log('BUCKET',bucket);

          //LOGIC TO ASSIGN SECOND VENDOR
          if(msg === 'Assign New Vendor'){
            console.log('ASSIGNING SECOND VENDOR');
            secondJobSecondVendor(bucket).then(async(secondmsg)=>{
              var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[1].vendorId },{threshold:false})
              console.log('second msg is it: ');
              console.log(secondmsg)
              const secondautoReject = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[1]},{vendorJobStatus:'AUTOREJECTED'})
              const secondbucket = await Bucket.find({order:order})
              console.log('BUCKET',secondbucket);

              if(secondmsg === 'Assign New Vendor'){
                console.log('Assign 3rd Vendor here');
                thirdJobThirdVendor(secondbucket).then(async(thirdmsg)=>{
                  var updateThreshold = await Vendor.updateOne({vendorId:acceptanceVendorFilter[2].vendorId },{threshold:false})
                  console.log('third msg is it: ');
                  console.log(thirdmsg)
                  const thirdautoReject = await Bucket.updateOne({order: order,vendor:acceptanceVendorFilter[2]},{vendorJobStatus:'AUTOREJECTED'})
                  const thirdbucket = await Bucket.find({order:order})
                  console.log('BUCKET',thirdbucket);
                  console.log('sadly ;),Sending order to pool');
                 
                  if(thirdmsg === 'Assign New Vendor'){
                    console.log('Assign to rest Vendors here');
                    assignToRestVendors(thirdbucket).then(async(fourthmsg)=>{
                     // let upOrder = await Order.updateOne({ orderId: order.orderId }, {isPool: true})

                      if(fourthmsg === 'Assign New Vendor'){
                        console.log('After all vednor assignment')
                       // let assignManualOrder = await Order.updateOne({ orderId: order.orderId }, {assignManually: true})
                        return response.json({message:"A VENDOR WOULD BE ASSIGNED SHORTLY, HAVE PATIENCE"})
                      }
                    })
                  }
                //  let order = await Order.updateOne({ orderId: order.orderId }, {isPool: true})
                //  return response.json({message:"A VENDOR WOULD BE ASSIGNED SHORTLY, HAVE PATIENCE"})
                })
              }
            })
          }
    })

   



   /*   const myTimeout = setTimeout(async()=>{
        clearTimeout(myTimeout);
        console.log('how many times');
        console.log('after response time', new Date().getTime());
        // clearInterval(interval);
        if(!acceptanceVendorFilter){
          return res.json({"message":"Vendor is Being assigned"})
        }else{
          return res.json({"message":"Vendor is Being assigned"})

        }
      }, 300000 * 3);    */

      /*
          // Send notification to vendor
    await firebaseService.sendNotification({
      registrationToken: vendor.fcmToken,
      title: 'New Order Assigned',
      body: `New order with Order-ID ${order.orderId} has been assigned to you.`
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903318015766',
      phone: vendor.phone,
      message: `Hi  ${vendor.ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
    })     */





    
      // // Send SMS
      // await smsService.send({
      //   type: 'TXN',
      //   senderId: 'HSEJOY',
      //   templateId: '1107167903365507452',
      //   phone: order.customer.phone,
      //   message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
      // })
    /*  res.status(200).json({
        result: 'success'
      }) */
  } catch (err) {
    console.log(err)
    next(err)
  }
}




exports.filter = async (req, res, next) => {

try{
  console.log(`orderId is: ${req.params.orderId}`)

    let order = await Order.findOne({ orderId: req.params.orderId }).populate('customer').populate('service').lean()
      if (!order) {
        throw {
          status: 404,
          message: 'Order not found'
        }
      }
      console.log('order',order);
      console.log('order city of customer',order.customer.addresses); 
      console.log('order service name',order.service.name); 
      let orderService =order.service;
      console.log('orderService', order.service);
      if(order.customer.addresses){
        var customerCity = order.customer.addresses;
      }
      console.log(customerCity);

      if(order.service.name){
        var orderServiceName = order.service.name;
      }


      const allvendors = await Vendor.find({}).lean()

      console.log('all vendors', allvendors);
      console.log('total Vendors',allvendors.length);
    /*  if(vendor.serviceProvided.includes(order.service)){
        console.log('yes');
      }*/
      
      const firstVendorFilter = [];
      var flag =false;
      var increment = 1;
      //basic Filter
      for await (eachVendor of allvendors){
        console.log('customer city is',customerCity[0].city);
        console.log('Each Vendor city is :', eachVendor.serviceArea.city);
        if(eachVendor.status == 'Active'){
          if(eachVendor.serviceArea.city === customerCity[0].city){
            console.log('Service provided by vendor',eachVendor.serviceProvided);
            
            console.log('EACH', eachVendor);
            
            for(var i=0;i<eachVendor.serviceProvided.length;i++){
              if(order.service._id == eachVendor.serviceProvided[i]){
                console.log('FLAG CHANGE TO TRUE BECAUSE SERVICE MATCHES WITH ORDER SERVICE');
                flag=true;
              }
            }
            console.log('FLAG', flag);
            if(flag){
              console.log('inside service provided true');
              if(eachVendor.availability){
                console.log('vendor availability increment is ',increment);
                ++increment;
                firstVendorFilter.push(eachVendor)
              }         
            }
          }
        }
      }
      console.log('waht is:',firstVendorFilter);
    }
      catch (err) {
        console.log(err)
        next(err)
      }
    }