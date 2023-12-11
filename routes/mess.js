const express = require('express');
const controllers = require('../controllers/mess')

const router = express.Router();

router.get('/:id' , controllers.index);
router.get('/get/all' , controllers.all);

module.exports = router;