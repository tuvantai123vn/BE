const express = require('express');
const controllers = require('../controllers/products');
const multer = require("multer");
const cloudinary = require('../configs/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "E-commerce_website"
    }
})

const upload = multer({ storage: storage });

router.use(upload.array('image', 4));
router.get('/topproducts', controllers.topProducts);
router.get('/category', controllers.products_category);
router.get('/detail/:id', controllers.productDetail);
router.get('/', controllers.getAll);
router.post('/newproduct', controllers.addProducts);
router.patch('/update', controllers.updateProduct);
router.delete('/delete/:id', controllers.deleteProduct);

module.exports = router;