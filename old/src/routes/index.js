module.exports = function (app) {
  // Public routes
  const servicesRoutes = require("./services");

  // Admin routes
  const adminAuthRoutes = require("./admin/auth");
  const adminVendorRoutes = require("./admin/vendor");
  const adminServiceRoutes = require("./admin/service");
  const adminOrderRoutes = require("./admin/order");
  const adminCustomerRoutes = require("./admin/customer");

  // Vendor routes
  const vendorRoutes = require("./vendor/vendor");
  const vendorOrderRoutes = require("./vendor/order");

  // Customer routes
  const customerAuthRoutes = require("./customer/auth");
  const customerAddressesRoutes = require("./customer/addresses");
  const customerOrderRoutes = require("./customer/order");

  // Webhooks reoutes
  const webhooksRoutes = require("./webhooks");

  const dependencies = require("./dep");
  const blogs = require("./blogs");
  const rentalAdminAuthRoutes = require("./rentalAdmin/auth");

  app.use("/services", servicesRoutes);
  app.use("/webhooks", webhooksRoutes);

  app.use("/admin/auth", adminAuthRoutes);
  app.use("/admin/vendor", adminVendorRoutes);
  app.use("/admin/service", adminServiceRoutes);
  app.use("/admin/order", adminOrderRoutes);
  app.use("/admin/customer", adminCustomerRoutes);

  app.use("/vendor", vendorRoutes);
  app.use("/vendor/order", vendorOrderRoutes);

  app.use("/customer/auth", customerAuthRoutes);
  app.use("/customer/addresses", customerAddressesRoutes);
  app.use("/customer/order", customerOrderRoutes);

  app.use("/dep/leads", dependencies);

  app.use("/blogs", blogs);

  app.use("/rentalAdmin", rentalAdminAuthRoutes);
};
