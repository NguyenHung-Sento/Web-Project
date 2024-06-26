const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const Product = require('../models/product')

const register = asyncHandler(async (req, res) => {
    const { email, password, mobile, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })

    const emailExists = await User.findOne({ email })
    const mobileExists = await User.findOne({ mobile })

    if (emailExists || mobileExists)
        throw new Error('User has existed!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register successfully. Please go login' : 'Something went wrong'
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password, mobile } = req.body
    if ((!email && !mobile) || !password) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        });
    }

    const query = email ? { email } : { mobile }
    const response = await User.findOne(query)
    if (response && await response.isCorrectPassword(password)) {
        //Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        //Tạo accessToken - Dùng để xác thực và phân quyền người dùng
        const accessToken = generateAccessToken(response._id, role)
        //Tạo refreshToken
        const newRefreshToken = generateRefreshToken(response._id)
        //Lưu refreshToken vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            userData: userData
        })
    } else {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById({ _id }).select('-refreshToken -password').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price category'
        }
    }).populate('wishlist', 'title thumb price category sold')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //Lấy token từ cookies
    const cookie = req.cookies
    //Check có token không
    if (!cookie && !cookie.refreshToken)
        throw new Error('No refresh token in cookie')
    //Check token hợp lệ không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not match'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xoá refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //Xoá refresh token ở cookies trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout successfully'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Xin Vui lòng click vào link dưới đây để thay đổi mật khẩu. Link sẽ hết hạn sau 15 phút. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Please check your email!' : 'Something went wrong, please try again!',
        rs
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpire: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangAt = Date.now()
    user.passwordResetExpire = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query }

    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)


    if (queries?.firstname) formatedQueries.firstname = { $regex: queries.firstname, $options: 'i' }

    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] = [
            { firstname: { $regex: queries.q, $options: 'i' } },
            { lastname: { $regex: queries.q, $options: 'i' } },
            { email: { $regex: queries.q, $options: 'i' } }
        ]
    }

    let queryCommand = User.find(formatedQueries)


    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }


    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }


    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message)
        const counts = await User.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get users',
        })
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} is deleted` : 'No user is deleted'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const user = await User.findById(_id)
    if (!user) throw new Error('User not found')

    if (req.body.email) {
        const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: _id } })
        if (emailExists) throw new Error('Email already exists!')
    }

    if (req.body.mobile) {
        const mobileExists = await User.findOne({ mobile: req.body.mobile, _id: { $ne: _id } })
        if (mobileExists) throw new Error('Mobile number already exists!')
    }

    if (req.body.password) {
        user.password = req.body.password
        await user.save()
    } else {
        const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-refreshToken -password -role')
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated' : 'Somgthing went wrong'
        })
    }
    return res.status(200).json({
        success: true,
        mes: 'Updated'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')

    if (req.body.email) {
        const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: uid } })
        if (emailExists) throw new Error('Email already exists!')
    }

    if (req.body.mobile) {
        const mobileExists = await User.findOne({ mobile: req.body.mobile, _id: { $ne: uid } })
        if (mobileExists) throw new Error('Mobile number already exists!')
    }

    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Somgthing went wrong'
    })
})


const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity } = req.body
    const product = await Product.findById(pid)
    if (!pid || !quantity) throw new Error('Missing input')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated cart' : 'Somgthing went wrong'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, thumb: product?.thumb[0], title: product?.title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated cart' : 'Somgthing went wrong'
        })
    }
})

const updateCartManyProducts = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const  currentCart  = req.body
    if (!currentCart || currentCart.length === 0) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        });
    }

    const updatedCart = currentCart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        thumb: item.thumb,
        title: item.title
    }))
    const user = await User.findByIdAndUpdate(
        _id,
        { cart: updatedCart },
        { new: true }
    ).populate('cart.product', 'name price')

    return res.status(200).json({
        success: true,
        cart: user.cart
    });
})

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (!alreadyProduct) {
        return res.status(200).json({
            success: true,
            mes: 'Updated cart'
        })
    }
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated cart' : 'Somgthing went wrong'
    })
})

const updateWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.params
    const user = await User.findById(_id)
    const isAlreadyInWishlist = user.wishlist?.find(el => el.toString() === pid)
    if(isAlreadyInWishlist){
        const response = await User.findByIdAndUpdate(
            _id,
            {$pull: {wishlist: pid}},
            {new: true}
        )
        return res.json({
            success: response ? true: false,
            mes: response ? 'Updated your wishlist': 'Fail to update'
        })
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            {$push: {wishlist: pid}},
            {new: true}
        )
        return res.json({
            success: response ? true: false,
            mes: response ? 'Updated your wishlist': 'Fail to update'
        })
    }
})

const removeProductInWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.params
    const user = await User.findById(_id).select('wishlist')
    const alreadyProduct = user?.wishlist?.find(el => el.toString() === pid)
    if (!alreadyProduct) {
        return res.status(200).json({
            success: true,
            mes: 'Updated wishlist'
        })
    }
    const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated wishlist' : 'Somgthing went wrong'
    })
})


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    logout,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateCart,
    removeProductInCart,
    updateCartManyProducts,
    updateWishlist,
    removeProductInWishlist
}