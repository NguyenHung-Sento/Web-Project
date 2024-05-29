const Order = require('../models/order')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {currentCart} = req.body
    const total = currentCart?.reduce((sum, el) =>  el.product.price * el.quantity + sum , 0)
    const rs = await Order.create({currentCart, total, orderBy:_id})
    return res.json({
        success : rs ? true : false,
        createdOrder: rs ? rs : 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async(req, res) => {
    const {oid} = req.params
    const {status} = req.body
    if(!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new:true}) 
    return res.json({
        success : response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

const getUserOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const response = await Order.find({orderBy: _id}) 
    return res.json({
        success : response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

const getOrders = asyncHandler(async(req, res) => {
    const response = await Order.find() 
    return res.json({
        success : response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

module.exports ={
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
}