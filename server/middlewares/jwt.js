const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => jwt.sign({_id:uid, role:role}, process.env.JWT_SECRET, {expiresIn:'2d'})
const generateRefreshToken = (uid) => jwt.sign({_id:uid}, process.env.JWT_SECRET, {expiresIn:'7d'})

module.exports = {
    generateAccessToken,
    generateRefreshToken
}