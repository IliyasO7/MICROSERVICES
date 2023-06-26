const _ = require('lodash')
const fs = require('fs')
const firebase = require('firebase-admin')

// Initialize firebase instance
firebase.initializeApp({
  credential: firebase.credential.cert(require('../../firebase.json'))
})

// Send notification
exports.sendNotification = async (params) => {
  try {
    console.log('Sending Notification', params)
    // Params: [registrationToken, title, body]
    
    await firebase.messaging().send({
      notification: {
        title: params.title || 'HouseJoy',
        body: params.body || null
      },
      token: params.registrationToken
    })

    return true

  } catch (err) {
    console.error(`Send notification error: ${err}`)
  }
}