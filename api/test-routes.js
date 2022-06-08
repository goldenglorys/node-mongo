//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

//Import Tet Questions controller
const TestController = require('../controllers/testCtrl')

//Add question to collection
router.post('/new-question', checkAuth, TestController.addTestQuestion)

//Update question
router.post('/update-question', checkAuth, TestController.updateTestQuestion)

//Archive a question
router.post('/suspend-question/:courseId', checkAuth, TestController.suspendTestQuestion)

//Re-activate a question
router.post('/activate-question/:courseId', checkAuth, TestController.activateTestQuestion)

//Retrieve questions from the database
router.get('/get-test/:courseId', checkAuth, TestController.getTestQuestions)

//Export the module for use in other modules
module.exports = router