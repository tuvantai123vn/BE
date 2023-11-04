const express = require('express');
const controllers = require('../controllers/mess')

const router = express.Router();

router.get('/mess/:id' , controllers.index);
router.get('/mess/get/all' , controllers.all);

module.exports = router;