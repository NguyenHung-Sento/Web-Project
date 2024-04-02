const router = require('express').Router()
const ctrls = require('../controllers/product')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/',[verifyAccessToken, isAdmin] , ctrls.createProduct)
router.get('/', ctrls.getProducts)

router.get('/:pid', ctrls.getProduct)
router.put('/:pid',[verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid',[verifyAccessToken, isAdmin] , ctrls.deleteProduct)
router.put('/uploadimage/:pid',[verifyAccessToken, isAdmin] ,uploader.array('images', 10), ctrls.uploadImagesProduct)
router.put('/uploadthumb/:pid',[verifyAccessToken, isAdmin] ,uploader.array('thumb', 1), ctrls.uploadThumbProduct)

module.exports = router