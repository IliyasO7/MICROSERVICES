// const fs = require('fs')

// exports.logRequests = function (req, res, next) {
//     let today = new Date();
//     let fileName = appRoot + '/logs/' + today.toISOString().substring(0,10) + ".txt";
//     let logObject = {}
//     res.on('finish', () => {
//         logObject = {
//             method : req.method,
//             reqBody: req.body,
//             reqHeaders: req.headers,
//             reqHost: req.hostname,
//             reqParams: req.params,
//             originlUrl: req.originalUrl,
//             statusCode : res.statusCode,
//         }

//         logValue = JSON.stringify(logObject) + `\n\n
//         ==================================================
//         \n\n
//         `
//         fs.writeFile(fileName, logValue, { flag: 'a+' }, err => {
//             console.log(err);
//         });
//     })
//     next();
// }
