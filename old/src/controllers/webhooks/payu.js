const mongoose = require('mongoose')
const dayjs = require('dayjs')
const fs = require('fs')
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid');

// Models
const Order = require('../../models/order')

// Services
const smsService = require('../../services/sms')

// Success
exports.success = async (req, res, next) => {
  try {

    var {txnid,amount,gateway,transactionId,mode,status} = req.body;
    console.log('inside success');
    
    if(typeof txnid === "undefined" || typeof amount === "undefined" || typeof mode === "undefined" || typeof status === "undefined" ){
          return res.status(500).json({
            error: true,
            message: "Parameter required",
          });
    }

    if(status === 'Success'){
      let orderId = req.body.txnid;
      console.log(orderId);

      // Amount
      let amountPaid = req.body.amount;
      if(mode === 'coupon'){
        var transactionIduuid =uuidv4();
        console.log(transactionIduuid);
        await Order.updateOne({orderId: orderId}, {
          $set: {
            "payment.status": 'Paid',
            "payment.mode": mode,
            "payment.amount": amountPaid,
            "payment.transactionId": transactionIduuid,
          }
        })
  
        var orderData= await Order.findOne({orderId: orderId})
        console.log(orderData);
        if(orderData){
         return  res.json({
            result: 'Success',
            message: 'ORDER UDPATED WITH COUPON MODE',
            data: orderData
          })
        }
      }
       if(typeof gateway === "undefined" || typeof transactionId === "undefined" ){
        return res.status(500).json({
          error: true,
          message: "Parameters required",
        });
      }    
      // Updare in DB
      await Order.updateOne({orderId: orderId}, {
        $set: {
          "payment.status": 'Paid',
          "payment.gateway": 'PayU',
          "payment.mode": mode,
          "payment.amount": amountPaid,
          "payment.transactionId": transactionId,

        }
      })

      var orderData= await Order.findOne({orderId: orderId})
      console.log(orderData);
      if(orderData){
       return  res.json({
          result: 'Success',
          data: orderData
        })
      }
    }else{
      let orderId = req.body.txnid;
      console.log(orderId);
      // Amount
      let amountPaid = req.body.amount;
      // Updare in DB
      await Order.updateOne({orderId: orderId}, {
        $set: {
          "payment.status": 'Unpaid',
          "payment.gateway": 'PayU',
          "payment.mode": mode,
          "payment.amount": amountPaid,
          "payment.transactionId": transactionId,

        }
      })
      var orderData= await Order.findOne({orderId: orderId})
      console.log(orderData);
      if(orderData){
       return  res.json({
          result: 'Failure',
          data: orderData
        })
      }
    }
  } catch (err) {
    next(err)
  }
}


/*

 // Order ID
    let orderId = req.body.txnid;

    // Amount
    let amountPaid = req.body.amount;

    

    // Updare in DB
    await Order.updateOne({orderId: orderId}, {
      $set: {
        "payment.status": 'Paid',
        "payment.gateway": 'PayU',
        "payment.mode": mode,
        "payment.amount": amountPaid,



      }
    })

    res.json({
      result: 'success'
    })*/