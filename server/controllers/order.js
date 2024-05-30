const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price thumb')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        title: el.title,
        thumb: el.thumb
    }))
    const total = userCart?.cart?.reduce((sum, el) =>  el.product.price * el.quantity + sum , 0)
    const rs = await Order.create({products, total, orderBy:_id, status: 'Processing'})
    return res.json({
        success : rs ? true : false,
        createdOrder: rs ? rs : 'Something went wrong'
    })
})

const createNotInCartOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const products = req.body
    const product = await Product.findById(products.product)
    const total = product.price * products.count
    const rs = await Order.create({products, total, orderBy:_id, status: 'Processing'})
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
        mes: response ? 'Updated' : 'Something went wrong'
    })
})


const getUserOrders = asyncHandler(async(req, res) => {
    const queries = {...req.query}
    const {_id} = req.user

    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    if(queries?.status) formatedQueries.status = {$regex: queries.status, $options: 'i'}
    if(queries?.search){
        delete formatedQueries.search
        formatedQueries['$or'] = [
            {status : {$regex: queries.search, $options: 'i'}},
        ]
    }
    const q = {...formatedQueries, orderBy: _id}
    let queryCommand = Order.find(q)

    //Sắp xếp
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Giới hạn số trường trả về mà người dùng muốn của sản phẩm
    if(req.query.fields){
        const fields =req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Phân trang
    //limit: Giới hạn số object lấy về mỗi khi gọi API
    //skip: Bỏ qua bao nhiêu object rồi mới lấy
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page-1) * limit
    queryCommand.skip(skip).limit(limit)

    //Excute query
    queryCommand.exec(async(err, response) => {
        if(err) throw new Error(err.message)
        const counts = await Order.find(q).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            orders : response ? response : 'Cannot get orders',
        })
    })
})

const getOrders = asyncHandler(async(req, res) => {
    const queries = {...req.query}


    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    if(queries?.status) formatedQueries.status = {$regex: queries.status, $options: 'i'}
    if(queries?.search){
        delete formatedQueries.search
        formatedQueries['$or'] = [
            {status : {$regex: queries.search, $options: 'i'}},
        ]
    }
    const q = {...formatedQueries}
    let queryCommand = Order.find(q)

    //Sắp xếp
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Giới hạn số trường trả về mà người dùng muốn của sản phẩm
    if(req.query.fields){
        const fields =req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Phân trang
    //limit: Giới hạn số object lấy về mỗi khi gọi API
    //skip: Bỏ qua bao nhiêu object rồi mới lấy
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page-1) * limit
    queryCommand.skip(skip).limit(limit)

    //Excute query
    queryCommand.exec(async(err, response) => {
        if(err) throw new Error(err.message)
        const counts = await Order.find(q).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            orders : response ? response : 'Cannot get orders',
        })
    })
})

module.exports ={
    createNotInCartOrder,
    createOrder,
    updateStatus,
    getUserOrders,
    getOrders
}