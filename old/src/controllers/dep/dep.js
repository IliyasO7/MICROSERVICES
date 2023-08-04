const mongoose = require('mongoose')
const axios = require('axios')
const randomstring = require('randomstring')
const _ = require('lodash');
const Customer = require('../../models/customer')
// Models
const Order = require('../../models/order')
const Service = require('../../models/service')
//const Customer = require('../../models/customer')
const leads = require('../../models/leads')
const newleads = require('../../models/newleads')

// Services
const orderService = require('../../services/order')
const customerService = require('../../services/customers')
const smsService = require('../../services/sms')
const customersService = require('../../services/customers')

const { JsonWebTokenError } = require('jsonwebtoken');
const { platform } = require('os');

let serviceIds = {
  3 : "63c94b6e9b197f413029fd33", // home cleaning
  21: "63d3ac84cdb9ea7cbf0d6299", // bathroom cleaning
  17: "63ced9da60630ffa3eebe7bd", // kitchen cleaning
  18: "63d3acdecdb9ea7cbf0d629e", // sofa cleaning
  20: "63d8e9de63b0fce1c44fbb89", // carpet cleaning
  15: "63d3ba04cdb9ea7cbf0d630a", // washing machine repair
  16: "63d8fb3da88952e82e7640fb", // ac repair
  14: "63d8fc65a88952e82e76410a", // refrigerator repair
  13: "63d901c3a88952e82e76411d", // geyser repair
  7 : "63d90285a88952e82e764120", // microwave repair
  4 : "63d3a9b1cdb9ea7cbf0d6289", // pest control
  12: "63d3ad6ecdb9ea7cbf0d62a7", // plumbing
  8 : "63d90355a88952e82e764125", // painting
  6 : "63d3ad1dcdb9ea7cbf0d62a1", // carpenter
  5 : "63d3ad42cdb9ea7cbf0d62a4", // electrician

  "Home Cleaning" : "63c94b6e9b197f413029fd33", // home cleaning
  "Bathroom Cleaning": "63d3ac84cdb9ea7cbf0d6299", // bathroom cleaning
  "Kitchen Cleaning": "63ced9da60630ffa3eebe7bd", // kitchen cleaning
  "Sofa Cleaning": "63d3acdecdb9ea7cbf0d629e", // sofa cleaning
  "Carpet Cleaning": "63d8e9de63b0fce1c44fbb89", // carpet cleaning
  "Washing Machine Repair": "63d3ba04cdb9ea7cbf0d630a", // washing machine repair
  "AC Repair": "63d8fb3da88952e82e7640fb", // ac repair
  "Refridgerator Repair": "63d8fc65a88952e82e76410a", // refrigerator repair
  "Geyser Cleaning": "63d901c3a88952e82e76411d", // geyser repair
  "Microwave Repair" : "63d90285a88952e82e764120", // microwave repair
  "Pest Control" : "63d3a9b1cdb9ea7cbf0d6289", // pest control
  "Plumbing": "63d3ad6ecdb9ea7cbf0d62a7", // plumbing
  "Painting" : "63d90355a88952e82e764125", // painting
  "Carpenter" : "63d3ad1dcdb9ea7cbf0d62a1", // carpenter
  "Electrician" : "63d3ad42cdb9ea7cbf0d62a4" // electrician
}

let formServices   = {
  3 : "Home Cleaning",          // home cleaning
  21: "Bathroom Cleaning",      // bathroom cleaning
  17: "Kitchen Cleaning",       // kitchen cleaning
  18: "Sofa Cleaning",          // sofa cleaning
  20: "Carpet Cleaning",        // carpet cleaning
  15: "Washing Machine Repair", // washing machine repair
  16: "AC Repair",              // ac repair
  14: "Refridgerator Repair",   // refrigerator repair
  13: "Geyser Cleaning",        // geyser repair
  7 : "Microwave Repair",       // microwave repair
  4 : "Pest Control",           // pest control
  12: "Plumbing",               // plumbing
  8 : "Painting" ,              // painting
  6 : "Carpenter" ,             // carpenter
  5 : "Electrician" ,           // electrician


}

exports.getAllLeads = async (req, res, next) => {
  try {
    console.log('inside get all leads');

    let service = await leads.find({}).lean()
    // console.log(service)
    console.log('services',service);
   let allLeads = []
    for await (element of service ){
      let formResponse = JSON.parse(element.reqBody);
      console.log('form Response ', formResponse);
        let optedService = {}
        console.log('before if else  element',element);
        console.log('before if else  element id :',element._id);
        console.log('before if else');
        if(formResponse.types_of_service_){
          console.log('inside raw type');
          optedService.name=formResponse.types_of_service_ 
        }else{
          if(typeof (formResponse.__submission.form_id) !== "undefined"){
            if(formResponse.__submission.form_id == 22){
              optedService.name = formResponse.dropdown;
            }
            else {
              optedService.name =formResponse.__submission.form_id !== null? formServices[formResponse.__submission.form_id] : formResponse.types_of_service_ ;
            }
          }
        }
     
       
        console.log('after if else');

        //  optedService.name =formResponse.__submission.form_id !== undefined? formServices[formResponse.__submission.form_id] : formResponse.raw__types_of_service_ ;
        console.log('after if else element id ',element._id);
        
        eachLead = {
          id1: element._id,
          id : element._id,
          remarks: element.remarks,
          time: element.time,
          status: element.status,
          opened: element.opened,
          optedService: {
            name: optedService.name
          },
          ...formResponse
        };
        console.log('Each lead', eachLead);
        console.log('before all leads push');
        allLeads.push(eachLead);
        console.log('after all leads push');
       
    }
 
    res.json({
      result: 'success',
      allLeads
    }) 

  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.createLead = async (req, res, next) => {
    // console.log(req.params.formId);
    // console.log(req.body.__submission.id);
    try {

        let ID = mongoose.Types.ObjectId()
    
        await new leads({
            _id: ID,
            reqBody: JSON.stringify(req.body),
            remarks: [],
            time: "",
            status: "unread"
        }).save()

        console.log("what is happening here");
    
        res.json({
            result: "woah, it's working... yet again"
        })
     
      } catch (err) {
        next(err)
      }   
  }

  exports.createFBLead = async (req, res, next) => {

    try {
      console.log('Request body is :', req.body);
    //  const remarks = 'remarks';

        let ID = mongoose.Types.ObjectId()
    
      const lead =  await new leads({
            _id: ID,
            reqBody: JSON.stringify(req.body),
            remarks: [],
            time: "",
            status: "unread"
        }).save()   
        console.log('lead', lead)

        console.log("what is happening here");
    
        res.json({
            result: "woah, it's working... yet again"
        })
    
      } catch (err) {
        next(err)
      }   
  }

  exports.updateLead = async (req, res, next) => {
    let toDb = {}
    
    let lead = await leads.findOne({_id: req.body.id}).lean();
   var jsonObject = JSON.parse(lead.reqBody);
    
     console.log('json object',jsonObject)
    // console.log(jsonObject.reqBody.__submission.updated_at, req.body.time)
    if(typeof jsonObject.platform == 'undefined'){
      jsonObject.__submission.updated_at = req.body.time;
    }else{
     jsonObject['when_would_you_prefer_the_inspection_to_take_place?'] = req.body.time
    }
    

    toDb = {$set: {
      status: req.body.status,
      reqBody: JSON.stringify(jsonObject)
      }
    }

    await leads.updateOne({_id: req.body.id}, toDb)

    toDb = {
        text: req.body.remarks.text,
        remarkTime: req.body.remarks.remarkTime,
    }
    
    await leads.updateOne({_id: req.body.id}, {$push: {remarks: toDb}})

    res.json({
        message: "Lead updated succefully"
    })
  }

  exports.createOrder = async (req, res, next) => {
    try {
  
      // Get customer
      let customer = await Customer.findOne({ phone: req.body.address.phone }).lean()
      if(!customer){
        let createCustomer = await customersService.create({
          fname: req.body.address.fname,
          lname: req.body.address.lname,
          email: req.body.address.email || "no@e.mail",
          phone: req.body.address.phone,
          password: req.body.address.password || "12345679",
          country: req.body.address.country || 'in'
        })
        customer = await Customer.findOne({ phone: req.body.address.phone }).lean()
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
          subtotal: req.body.subtotal || 0,
          taxes: [],
          total: req.body.total,
        }
      }
  
      // Check if all filters are supplied
      // let suppliedFilters = _.map(req.body.filters, 'filterId')
      // for(var filter of service.filters){
      //   if(!_.includes(suppliedFilters, _.toString(filter._id))){
      //     throw new Error(`Filter value for "${filter.title}" is not supplied`)
      //   }
      // }
  
      // Calculate subtotal prices
      // order.amount.subtotal += service.price 
  
      // Add filters price to subtotal
      // for(var o of req.body.filters){
  
      //   let filter = _.find(service.filters, (i) => { return i._id == o.filterId })
      //   let option = _.find(filter.options, (i) => { return i._id == o.optionId })
  
      //   order.service.subLines.push(`${filter.title}: ${option.value}`)
  
      //   order.amount.subtotal += option.price
  
      // }
  
      // Calculate total price
      order.amount.total = order.amount.subtotal // + _.sumBy(order.amount.taxes, 'amount')
  

      // console.log({
      //   _id: mongoose.Types.ObjectId(),
      //   orderId: "orderId",
      //   customer: customer._id,
      //   service: service._id,
      //   address: req.body.address,
      //   taxes: order.amount.taxes,
      //   'payment.amount': order.amount.total,
      //   serviceDate: req.body.serviceDate,
      //   serviceTime: req.body.serviceTime,
      //   // filters: order.service.subLines.length > 0 ? _.join(order.service.subLines, '\n') : null,
      // })

      // If order is final
      if(req.body.isFinal){
        let orderId = _.toUpper(randomstring.generate(7))
        await new Order({
          _id: mongoose.Types.ObjectId(),
          orderId: orderId,
          customer: customer._id,
          service: service._id,
          address: req.body.address,
          taxes: order.amount.taxes,
          'payment.amount': order.amount.total,
          serviceDate: req.body.serviceDate,
          serviceTime: req.body.serviceTime,
          // filters: order.service.subLines.length > 0 ? _.join(order.service.subLines, '\n') : null,
        }).save()
        order.orderId = orderId
        // Send SMS
        await smsService.send({
          type: 'TXN',
          senderId: 'HSEJOY',
          templateId: '1107167223418440431',
          phone: customer.phone,
          message: `Thank you for using HouseJoy Service! Your booking ID: ${orderId} is confirmed on ${order.createdAt}, ${order.createdAt}. Our professional partner will get back to you shortly.`
        })
      }
      res.json({
        result: 'success',
        order: order
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }


  exports.leadDetails = async (req, res, next) => {
    try {
      console.log('lead id', req.params.id);
      
      let service = await leads.find({ _id: req.params.id }).lean()
      // console.log(service)
      let allLeads = []
      for await (element of service ){
        let formResponse = JSON.parse(element.reqBody);
        console.log('form response',formResponse);
        if(typeof formResponse.platform === 'undefined' ){
          console.log('if condition properly checked');
          var optedService = await Service.findOne({ _id: serviceIds[formResponse.__submission.form_id] }).lean() 
          if(!optedService){
            optedService = await Service.findOne({ _id: serviceIds[formResponse.dropdown] }).lean()
          }
        }else{
          console.log('else after form');

          let serviceId = mongoose.Types.ObjectId()

         let newservice =  await new Service({
            _id: serviceId,
            name: formResponse.types_of_service_,
            slug: _.kebabCase(formResponse.types_of_service_),
            category: 'Cleaning Services',
            commission: 0,
            price:0,
          }).save()
          console.log('service',newservice);
        optedService = await Service.findOne({ _id:  serviceId }).lean()
          console.log('opted service',optedService);
        }
         
  
          eachLead = {
            id : element._id,
            remarks: element.remarks,
            time: element.time,
            status: element.status,
            opened: element.opened,
            optedService: {
              _id: optedService._id,
              name: optedService.name,
              slug: optedService.slug,
              category: optedService.category,
              price: optedService.price,
              filters: optedService.filters 
            },
            ...formResponse
          };
          
          allLeads.push(eachLead);
      }
  
      [resLead] = allLeads
      res.json({
        ...resLead
      })
  
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  //only FB Leads as of now
  exports.createnewLead = async (req, res, next) => {
    try {
      if(!req.body){
        return res.status(200).json({
          result: 'Something Went Wrong',
          message: 'Req Body is Required'
        })
      }
      console.log('req.body is:',req.body);
      var service = await Service.findOne({ name: req.body.types_of_service_  }).lean() // req.body.types_of_service_
      if(!service){
        var service = await Service.findOne({ _id: '63c94b6e9b197f413029fd33'}).lean() // 63c94b6e9b197f413029fd33
      }
      const customerName = req.body.full_name;
      const  phone =req.body.phone_number;
      const  email =req.body.email;
      const city = req.body.city;
      const platform= req.body.platform;  
    //  console.log('Inspection :', req.body['when_would_you_prefer_the_inspection_to_take_place?']);
      let ID = mongoose.Types.ObjectId()
          const newLead = await new newleads({
                _id: ID,
                service:service,
                customerName: customerName,
                phone: phone,
                email:email,
                city:req.body.city,
                platform:req.body.platform,
                inspectionDate :req.body['when_would_you_prefer_the_inspection_to_take_place?'],
                remarks: [],
                time: "",
                status: "unread"
            }).save();
        console.log('Before response');
        res.json({
            result: "woah, it's working... yet again",
            data:newLead
        })
      } catch (err) {
        next(err)
      }   
  }

  exports.getAllNewLeads = async (req, res, next) => {
    try {
      console.log('inside get all leads');
      let service = await newleads.find({}).populate('service').lean()
      console.log('services',service);
      let allLeads = []
      for await (element of service){
        allLeads.push(element)
      }
      res.json({
        result: 'success',
        allLeads
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  exports.newleadDetails = async (req, res, next) => {
    try {
      let service = await newleads.findOne({ _id: req.params.id }).populate('service').lean()
      res.json({
        result: 'success',
        data: service
      })
    }
     catch (err) {
      console.log(err)
      next(err)
    }
  }

  exports.updatenewLead = async (req, res, next) => {
    console.log('inside update new Lead',req.body);
    let toDb = {}
    let lead = await newleads.findOne({_id: req.body.id}).lean();
  //   updating null services
 //   var service = await Service.findOne({ _id: '63c94b6e9b197f413029fd33'}).lean() // 63c94b6e9b197f413029fd33
 //   updatedlead =   await newleads.updateOne({_id: req.body.id}, {service:service})
     toDb = {
        text: req.body.remarks.text,
        remarkTime: req.body.remarks.remarkTime,
    }
    console.log('to Db',toDb);
    var date = new Date();
    console.log('date',date);
    
var updatedlead =   await newleads.updateOne({_id: req.body.id}, {$push: {remarks: toDb}} )
    updatedlead =   await newleads.updateOne({_id: req.body.id}, {updatedAt:date,status:'read'})

    //console.log('updated Lead',updatedlead);
    res.json({
        message: "Lead updated succefully",
        data:updatedlead
    })
  }


  exports.createLeadOrder = async (req, res, next) => {
    try {
  
      // Get customer and Create new Customer  
      var createCustomer = await Customer.findOne({ phone: req.body.address.phone }).lean()
      var createCustomer = await Customer.findOne({ email: req.body.address.email }).lean()
   
    /*  if(createCustomer){
        console.log('error');
        return res.status(500).json({
          result: 'Something Went Wrong',
          message: 'email and customer already Exists'
        })
      } */ 
      if(!createCustomer){
        let ID = mongoose.Types.ObjectId()
        var createCustomer = await new Customer({
          _id:ID,
          fname: req.body.address.fname,
          lname: req.body.address.lname,
          email: req.body.address.email || "no@e.mail",
          phone: req.body.address.phone,
          password: req.body.address.password || "12345679",
          country: req.body.address.country || 'in'
        }).save()
       
        console.log('cid',createCustomer);

        let addressId = await mongoose.Types.ObjectId()

        await Customer.updateOne({ _id: createCustomer._id }, {
          $push: {
            addresses: {
              _id: addressId,
              fname: req.body.address.fname,
              lname: req.body.address.lname,
              phone: req.body.address.phone,
              address: req.body.address.address,
              city:  req.body.address.city,
              state: req.body.address.state,
              pincode: req.body.address.pincode,
              country: req.body.address.country || 'in'
            }
          }
        })
    
     //   customer = await Customer.findOne({ phone: req.body.address.phone }).lean()
    //   console.log('suctoemr is', customer);
      }
  
        // Service
        let service = await Service.findOne({ _id: req.body.serviceId }).lean()
        console.log('service',service);
        console.log('service id',service._id);
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
    
  
    
        // Calculate subtotal prices
        order.amount.subtotal += service.price 
    
        // Add filters price to subtotal
    
    
        // Calculate total price
        order.amount.total = order.amount.subtotal + _.sumBy(order.amount.taxes, 'amount')
    
        // If order is final
        if(req.body.isFinal){
    
          let orderId = _.toUpper(randomstring.generate(7))
          let now = new Date();
          now = new Date(now.getTime() + 330*60000);
          let nowStr = now.toString();
          let nowDate = nowStr.substring(0, 15);
          let nowTime = nowStr.substring(16, 24)
          console.log('orderId',orderId);
          await new Order({
            _id: mongoose.Types.ObjectId(),
            orderId: orderId,
            customer: createCustomer._id,
            service: service._id,
            address: req.body.address,
            taxes: order.amount.taxes,
            'payment.amount': order.amount.total,
            serviceDate: req.body.serviceDate,
            serviceTime: req.body.serviceTime,
           
          }).save()
    
          order.orderId = orderId
    
          
          // Send SMS
          await smsService.send({
            type: 'TXN',
            senderId: 'HSEJOY',
            templateId: '1107167223418440431',
            phone: createCustomer.phone,
            message: `Thank you for using HouseJoy Service! Your booking ID: ${orderId} is confirmed on ${nowDate}, ${nowTime}. Our professional partner will get back to you shortly.`
          })
    
        }
    
        res.json({
          result: 'success',
          order: order
        })
    
      } catch (err) {
      console.log(err)
      next(err)
    }
  }


