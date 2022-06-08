//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import auth controller
const RaveController = require('../controllers/raveCtrl')

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

router.post('/verify/:txref/course/:course_id', checkAuth, RaveController.verifyPayment);

//Export the module for use in other modules
module.exports = router