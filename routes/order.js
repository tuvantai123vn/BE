const express = require('express');
const controllers = require('../controllers/Order')

const router = express.Router();

router.post('/checkout', controllers.checkout);
router.get('/:id', controllers.Order);
router.get('/getuser/:id', controllers.OrderUser);
router.get('/get/allorder', controllers.getAllOrder);

module.exports = router;