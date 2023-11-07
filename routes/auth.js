const express = require('express');
const controllers = require('../controllers/auth')

const router = express.Router();

router.post('/register' ,controllers.register);
router.post('/login', controllers.login);
router.post('/logout', controllers.logout);
router.get('/getcart/:id' , controllers.getCart);
router.post('/addToCart', controllers.addToCart);
router.post('/loginadmin', controllers.loginAdmin);
router.get('/getalluser',controllers.getAllUsers);
router.get('/:id', controllers.detail);
router.put('/update', controllers.updateToCart);
router.put('/delete', controllers.deleteToCart);

module.exports = router;