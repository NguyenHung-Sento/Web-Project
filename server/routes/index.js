const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const orderRouter = require('./order')
const brandRouter = require('./brand')
const dashboardRouter = require('./dashboard')
const {notFound, errHandler} = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/prodcategory', productCategoryRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/dashboard', dashboardRouter)

    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes