const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async(req, res) =>{
    if (Object.keys(req.body).length === 0) 
        throw new Error('Missing inputs!')
    if (req.body && req.body.title) 
        req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true : false,
        createdProduct : newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async(req, res) =>{
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success : product ? true : false,
        productData : product ? product : 'Cannot get product'
    })
})

const getProducts = asyncHandler(async(req, res) =>{
    const products = await Product.find()
    return res.status(200).json({
        success : products ? true : false,
        productDatas : products ? products : 'Cannot get products'
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
    uploadImagesProduct
}