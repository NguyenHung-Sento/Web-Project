const router = require('express').Router()
const ctrls = require('../controllers/dashboard')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.get('/',[verifyAccessToken, isAdmin] , ctrls.dashboardController)


module.exports = router