//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import auth controller
const AuthController = require('../controllers/authCtrl')

//Import Multer Configuration
const upload = require('../middleware/multerConfig')

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

//This root route handle the submision of incoming registration data to the database
router.post('/signup', AuthController.signup);

//Handle login route
router.post('/login', AuthController.login);

//Handle get request for a single user based on their specific ID gotten from token (PROTECTED)
router.get('/me', checkAuth, AuthController.me);

//Handle updating of log in user (PROTECTED)
router.post('/updateProfile', checkAuth, AuthController.updateProfile);

//Handle seding of link to reset user password
router.post('/sendPasswordresetLink', AuthController.sendPasswordresetLink);

//Handle resetting of user password through the link sent and if the token with the link is correct
router.post('/resetPassword/:token', AuthController.resetPassword);

//Handle resetting of the log in user and (PROTECTED) based on the logged in user to be able to access it
router.post('/changePassword', checkAuth, AuthController.changePassword);

//Handle uploading of avatar 
router.post('/uploadAvatar', checkAuth, upload.single('avatar'), AuthController.uploadAvatar)

//Export the module for use in other modules
module.exports = router