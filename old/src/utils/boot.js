const connectMongoDB = require("./db");

const boot = async () => {
  await connectMongoDB();
  console.log("Booted successfully");
};

module.exports = boot;
