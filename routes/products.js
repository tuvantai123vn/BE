const express = require('express');
const controllers = require('../controllers/products')

const router = express.Router();

router.get('/topproducts', controllers.topProducts);
router.get('/category', controllers.products_category);
router.get('/detail/:id', controllers.productDetail);
router.get('/', controllers.getAll);
router.post('/newproduct', controllers.addProducts);
router.patch('/update', controllers.updateProduct);
router.delete('/delete/:id', controllers.deleteProduct);

module.exports = router;