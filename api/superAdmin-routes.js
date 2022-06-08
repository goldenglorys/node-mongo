//Import express web framework for node.js
const express = require('express');

//Initialize the router
const router = express.Router();

//Import check-auth middleware
const checkAuth = require('../middleware/check-auth')

//Import suAdmin controller
const SuperAdminController = require('../controllers/superAdminCtrl')

//Let Super Admin get all users (PROTECTED)
router.get('/allusers', checkAuth, SuperAdminController.getAllUsers);

//Handle get request for a single user of all user to be accessed  by the super admin (PROTECTED)
router.get('/getOneUser/:userId', checkAuth, SuperAdminController.getOneUser);

//Handling deleting of user (PROTECTED)
router.post('/deactivateuser/:userId', checkAuth, SuperAdminController.deactivateOneUser);suspendStaffLevel

//handle accepance of instructors
router.get('/acceptinstructor/:userId', checkAuth, SuperAdminController.acceptInstructors);

//handle suspension of staff
router.get('/suspendstaff/:userId', checkAuth, SuperAdminController.suspendOneStaff);

//handle suspension of staff level
router.get('/suspendstaff/:level_id', checkAuth, SuperAdminController.suspendStaffLevel);

//handle re-activattion of staff level
router.get('/activatestaff/:level_id', checkAuth, SuperAdminController.reactivateStaffLevel);

//handle adding of more staff levels if any
router.post('addstafflevel', checkAuth, SuperAdminController.addStaffLevel);

//Export the module for use in other modules
module.exports = router