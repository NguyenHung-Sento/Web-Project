const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current',verifyAccessToken , ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/current', verifyAccessToken, ctrls.updateUser)
router.put('/cart', verifyAccessToken, ctrls.updateCart)
router.delete('/remove-cart/:pid', verifyAccessToken, ctrls.refreshAccessToken)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)

module.exports = router