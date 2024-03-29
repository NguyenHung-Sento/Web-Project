const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const register = asyncHandler(async(req, res) =>{
    const {email, password, firstname, lastname} = req.body
    if(!email || !password || !firstname || !lastname)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
    })

    const user = await User.findOne({email})
    if (user)
        throw new Error('User has existed!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register successfully. Please go login' : 'Something went wrong'
        })
    }    
})

const login = asyncHandler(async(req, res) =>{
    const {email, password, firstname, lastname} = req.body
    if(!email || !password)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
    })

   const response = await User.findOne({email})
   if (response && await response.isCorrectPassword(password)){
        const {password, role, ...userData} = response.toObject()
        return res.status(200).json({
            success: true,
            userData: userData
        })
   } else {
        throw new Error('Invalid credentials!')
   }
})

module.exports = {
    register,
    login
}