const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')

const dashboardController = asyncHandler(async (req, res) => {
    const totalOrder = await Order.count();
    const totalProduct = await Product.count();
    const totalUser = await User.count();
    const orders = await Order.find();

    const revenue = orders.reduce((acc, order) => acc + order.total, 0);

    return res.status(200).json({
        result: {
            totalOrder,
            totalProduct,
            totalUser,
            revenue,
        },
    });
})
module.exports = {dashboardController}
