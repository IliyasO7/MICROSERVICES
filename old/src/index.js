require("dotenv").config(); //environment variables
const boot = require("./utils/boot");
const express = require("express"); //express webserver
const morgan = require("morgan"); // morgan logger
const cors = require("cors"); // cors
const bodyParser = require("body-parser"); // body parser
const mongoose = require("mongoose"); // mongoose
const logger = require("./middlewares/logger");
const app = express();
const path = require("path");

global.appRoot = path.resolve(__dirname);

app.use(morgan("dev"));
app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  sendResponse(res, 200, "Server is working");
});
// connect database

// logger middleware
app.use(logger.logRequests);
// Inlcude routes
require("./routes")(app);

app.use("/web", (req, res, next) => {
  console.log("inside webhook", req.body);

  res.status(err.status || 500).json({
    result: "error",
    message: err.message || err,
  });
});
// Error handling
app.use((err, req, res, next) => {
  err.status = err.status || 500;

  res.status(err.status || 500).json({
    result: "error",
    message: err.message || err,
  });
});

boot().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Service is listening on port ${process.env.PORT}`);
  });
});
