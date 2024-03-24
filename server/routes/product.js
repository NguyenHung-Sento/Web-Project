const router = require('express').Router()
const ctrls = require('../controllers/product')
router.post('/', ctrls.createProduct)

module.exports = router