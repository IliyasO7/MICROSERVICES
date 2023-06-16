require('dotenv').config() //environment variables

const express = require('express') //express webserver
const morgan = require('morgan') // morgan logger 
const cors = require('cors') // cors
const bodyParser = require('body-parser') // body parser
const mongoose = require('mongoose') // mongoose
const logger = require('./api/middlewares/logger')
const app = express()
const path = require('path');

global.appRoot = path.resolve(__dirname);

app.use(morgan('dev'))
app.use(cors({
    'Access-Control-Allow-Origin': "*", // 'https://housejoygroup.com/',
    'Vary': 'Origin',
    'methods': ['GET', 'POST', 'HEAD', 'DELETE', 'PUT', 'PATCH', 'OPTIONS']
  }))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*",);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE,GET');
        return res.status(200).json({});
    }
    next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// connect database
mongoose.connect(process.env.MONGODB_URL)

// logger middleware
app.use(logger.logRequests)
// Inlcude routes
require('./routes')(app)

app.use('/web',(req, res, next) => {
    console.log('inside webhook',req.body); 
    
    res.status(err.status || 500).json({
        result: 'error',
        message: err.message || err
    })
})
// Error handling
app.use((err, req, res, next) => {
    err.status = err.status ||  500

    res.status(err.status || 500).json({
        result: 'error',
        message: err.message || err
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server started at port ' + process.env.PORT)
})  