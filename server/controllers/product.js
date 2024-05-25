const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const { Query } = require('mongoose')
const slugify = require('slugify')

const createProduct = asyncHandler(async(req, res) =>{
    const {title, price, description, brand, category, productType} = req.body
    const thumb = req.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category && productType)) 
        throw new Error('Missing inputs')
    req.body.slug = slugify(title)
    if(thumb) req.body.thumb = thumb
    if(images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true : false,
        createdProduct : newProduct ? newProduct : 'Cannot create new product'
    })
})

//Lấy sản phẩm có lọc, có sắp xếp
const getProduct = asyncHandler(async(req, res) =>{
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success : product ? true : false,
        productData : product ? product : 'Cannot get product'
    })
})

const getProducts = asyncHandler(async(req, res) =>{
    const queries = {...req.query}

    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    let productTypeQueryObject = {}
    //Lọc
    if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    if(queries?.category) formatedQueries.category = {$regex: queries.category, $options: 'i'}
    if(queries?.productType){
        delete formatedQueries.productType
        const productTypeArr = queries.productType?.split(',')
        const productTypeQuery = productTypeArr.map(el => ({productType: {$regex: el, $options: 'i'}}))
        productTypeQueryObject = {$or: productTypeQuery}
    }
    let brandQueryObject = {}
    if(queries?.brand){
        delete formatedQueries.brand
        const brandArr = queries.brand?.split(',')
        const brandQuery = brandArr.map(el => ({brand: {$regex: el, $options: 'i'}}))
        brandQueryObject = {$or: brandQuery}
    }

    if(queries?.search){
        delete formatedQueries.search
        formatedQueries['$or'] = [
            {title : {$regex: queries.search, $options: 'i'}},
            {category : {$regex: queries.search, $options: 'i'}},
            {productType : {$regex: queries.search, $options: 'i'}},
            {brand : {$regex: queries.search, $options: 'i'}},
        ]
    }
    const q = {...productTypeQueryObject, ...formatedQueries, ...brandQueryObject}
    let queryCommand = Product.find(q)

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
        const counts = await Product.find(q).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            counts,
            productDatas : response ? response : 'Cannot get products',
        })
    })
})

const updateProduct = asyncHandler(async(req, res) =>{
    const {pid} = req.params
    id (req.body && req.body.title) 
        req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        success : updatedProduct ? true : false,
        updatedProduct : updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async(req, res) =>{
    const {pid} = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid, req.body, {new: true})
    return res.status(200).json({
        success : deletedProduct ? true : false,
        deletedProduct : deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const uploadImagesProduct = asyncHandler(async(req, res) => {
    const {pid} = req.params
    if(!req.files) throw new Error('Missing input')
    const response = await Product.findByIdAndUpdate(pid, {$push:{images: {$each: req.files.map(el => el.path)}}}, {new:true})
    return res.status(200).json({
        status: response ? true:false,
        updatedProduct: response ? response:'Cannot update images'
    })
})


module.exports={
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    uploadImagesProduct,
}