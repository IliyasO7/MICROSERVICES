module.exports = function (app) {

    // Public routes
    const servicesRoutes = require('./api/routes/services')

    // Admin routes
    const adminAuthRoutes = require('./api/routes/admin/auth')
    const adminVendorRoutes = require('./api/routes/admin/vendor')
    const adminServiceRoutes = require('./api/routes/admin/service')
    const adminOrderRoutes = require('./api/routes/admin/order')
    const adminCustomerRoutes = require('./api/routes/admin/customer')

    // Vendor routes
    const vendorRoutes = require('./api/routes/vendor/vendor')
    const vendorOrderRoutes = require('./api/routes/vendor/order')

    // Customer routes
    const customerAuthRoutes = require('./api/routes/customer/auth')
    const customerAddressesRoutes = require('./api/routes/customer/addresses')
    const customerOrderRoutes = require('./api/routes/customer/order')

    // Webhooks reoutes
    const webhooksRoutes = require('./api/routes/webhooks')

    const dependencies = require('./api/routes/dep')
    const blogs = require('./api/routes/blogs')
    
    app.use('/services', servicesRoutes)
    app.use('/webhooks', webhooksRoutes)

    app.use('/admin/auth', adminAuthRoutes)
    app.use('/admin/vendor', adminVendorRoutes)
    app.use('/admin/service', adminServiceRoutes)
    app.use('/admin/order', adminOrderRoutes)
    app.use('/admin/customer', adminCustomerRoutes)

    app.use('/vendor', vendorRoutes)
    app.use('/vendor/order', vendorOrderRoutes)

    app.use('/customer/auth', customerAuthRoutes)
    app.use('/customer/addresses', customerAddressesRoutes)
    app.use('/customer/order', customerOrderRoutes)

    app.use('/dep/leads', dependencies)

    app.use('/blogs', blogs)
}