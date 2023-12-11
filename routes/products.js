const express = require('express');
const controllers = require('../controllers/products');
const multer = require("multer");
const cloudinary = require('../configs/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();


// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname;
//     const fileName = originalName.replace(/\s+/g, ""); // Remove spaces
//     cb(null, fileName);
//   },
// });
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "E-commerce_website"
    }
})

const upload = multer({ storage: storage });

router.get('/topproducts', controllers.topProducts);
router.get('/category', controllers.products_category);
router.get('/detail/:id', controllers.productDetail);
router.get('/', controllers.getAll);
router.post('/newproduct', upload.array('image', 4), controllers.addProducts);
router.patch('/update', controllers.updateProduct);
router.delete('/delete/:id', controllers.deleteProduct);

module.exports = router;