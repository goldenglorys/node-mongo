//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import Public controller
const PublicController = require('../controllers/publicCtrl')

//handle showing courses to the public with the option to paid before accessing 
router.get('/showCourse', PublicController.showCourse);

//handle showing courses to the public by category
router.get('/showCourseByCategory/:categoryID', PublicController.showCourseByCategory);

//handle showing courses category to the public
router.get('/showCourseCategory', PublicController.showCategory);

//handle showing courses category to the public
router.get('/showstafflevel', PublicController.showStaffLevel);

//Export the module for use in other modules
module.exports = router