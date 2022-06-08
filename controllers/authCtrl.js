    //Import bcrypt to hash password
const bcrypt = require('bcryptjs');

//Importation
const path = require('path')

//Import validator to valid incoming email address
const validator = require("email-validator");

//Import jsonwebtoken to generate token when user login for authentication
const jwt = require("jsonwebtoken");

//Import multer middleware to upload files
const multer = require('multer');

//Import nodemailer to email user
const nodemailer =  require('nodemailer');

//Import users database schema
const User =  require('../models/userModel');

//Import password reset database schema
const PasswordReset =  require('../models/passwordResetModel');


//Handle signup without auth for all users
signup = (req, res) => {
    //Validate incoming email address before proceeding
    if(validator.validate(req.body.email)){
        //If email already exist do not create account
        User.findOne({ email: req.body.email, }).then(user => {
            if(user.email == req.body.email){
                res.status(400).json({
                    message: 'Email already exist'
                })
            }
        })

        //If username already exist do not create account
        User.findOne({ username: req.body.username, }).then(user => {
            if(user.username == req.body.username){
                res.status(400).json({
                    message: 'Username already exist'
                })
            }
        })

        //Create account if username and email aren't in db
        var hash = bcrypt.hashSync(req.body.password, 10);
        const userData = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            age: req.body.age,
            date_of_birth: req.body.date_of_birth,
            email: req.body.email,
            password: hash,
        });
        userData.save().then(
        saved => {
            console.log("Saved to database with a unique ID of: " + saved._id)
            res.status(200).json({
                success: true,
                id: saved._id,
                message: 'User created successfully!',
            })
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        })
    } else{
        res.status(400).json({
            message: 'Invalid email address',
        })
    }
};

//Handle login and and generate token to be stored to the client and send back for verification when requesting for a protected route api
login = (req, res, next) => {
	let email = req.body.email
    let pswd = req.body.password
    User.findOne({ email: email, status: 'active' }).then( user => { 

        if (user) {
            var compareHash = bcrypt.compareSync(pswd, user.password);
            if (compareHash) {
                const token = jwt.sign({
                    _id: user._id,
                    username: user.username,
                    regDate: user.regDate,
                    regTime: user.regTime,
                    isLearner: user.isLearner,
                    isInstructor: user.isInstructor,
                    isSuperAdmin: user.isSuperAdmin,
                    staffLevelStatus: user.staffLevelStatus,
                    status: user.status,
                    isSuspended: user.isSuspended,
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    })
                const { password, ...userWithoutPassword } = user.toObject()
                
                res.status(200).json({
                    message: 'Authentication successful',
                    user: userWithoutPassword,
                    token: token
                })
            } else{
                res.status(401).json({
                    message: "Auth failed"
                })
            }
        }else{
            res.status(401).json({
                message: "Auth failed"
            })
        }
    }).catch( err => {
        res.status(500).json({
            message: 'An error occured'
        })
    })
}

//Handle displaying of data of a single user based on their id (PROTECTED)
me = (req, res) => {
    const uID = req.authData._id;
    User.findById(uID).select('firstname lastname username email age date_of_birth regDate regTime isLearner isInstructor isSuperAdmin isSuspended isStaffStatus staffLevelStatus status avatar.path _id').then(
        result => {
        res.status(200).json({
            result: result,
            request: {
                type: "GET",
                url: 'http://'+req.headers.host+'/users'
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({
            err,
        })
    })
}

//Handles forgot password and generate token to be stored to forgot password database
sendPasswordresetLink = (req, res) => {
    //Validate the inputed email address before proccedding else it'll return INVALID EMAIL ADDRESS
    if(validator.validate(req.body.email)){
        let userEmail = req.body.email
        //Find if the email is really in the database else it return USER NOT FOUND
        User.findOne({ email: userEmail }).then(user => { 
            if (!user) {
                res.status(500).json({
                    message: 'User not found'
                })
            }
            else{  
                //If email is in db, then move to resetpassword collection to check whether that paricular email/user
                //has token already generated the last time he/she forgot password 
                PasswordReset.findOne({ email: userEmail })
                .then(inHouseToken => {
                    //If token of that email/user found in house it take it out else it generate new one and save to 
                    //db for future use
                    if(inHouseToken){
                        var token = inHouseToken.resetPasswordToken;
                    }else{
                         var token = jwt.sign(
                            {
                                _id: user._id,
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: "1h"
                            }
                        )
                        const resetData = new PasswordReset({
                            email: userEmail,
                            resetPasswordToken: token,
                        });
                        resetData.save()
                    }
                    //After TOKEN is get from either end an email us send to the user to update password through 
                    //the link sent
                         var smtpTransport = nodemailer.createTransport({
                            host: process.env.MAIL_HOST,
                            port: process.env.MAIL_PORT,
                            secure: false,
                            auth: {
                                //allow less secured app settings must be selected for this gmail account
                                user: process.env.MAIL_USERNAME,
                                pass: process.env.MAIL_PASSWORD,
                            }
                        });
                        var mailOptions = {
                            to: user.email,
                            from: process.env.MAIL_FROM_ADDRESS,
                            subject: 'Account Password Reset',
                            html: '<p>You are receiving this because there was a request to reset the password for your account.<br>' +
                              'Please click on the following link, or paste this into your browser to complete the process:<br>' +
                              '<a style="text-decoration: none;" href="https://' + req.headers.host + '/reset/' + token +'">Reset Password</a><br>'+
                              'If you did not make a password reset request, please ignore this email. Thanks.\n</p>'
                        };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        if(err){
                            return res.status(500).json({
                                message: 'error',
                                error: err
                            })
                        }
                        res.status(200).json({
                            message: 'Email sent',
                        })
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'An error occured',
                        error: err
                    })
                })
            }
        })
    }else {
        res.status(400).json({
            message: 'Invalid email address',
        })
    }
}

resetPassword = (req, res) => {
    //get user id based on login user provided token
    const token = req.params.token;
    //get new password from the request body
    const  newPassword  = req.body.newPassword
    PasswordReset.findOne({ token: token })
    .then(inHouseToken => {
        if (inHouseToken) {
            //find user with that email if token is right
            User.findOne({ email: email})
            .then( user => {
                let hash = bcrypt.hashSync(newPassword, 10)
                User.findOneAndUpdate({email: email}, {password: hash})
                .then(() => res.status(200).json({message: 'Password change Successful'}))
                .catch( err => res.status(500).json(err))
            })
            .catch(() => {
                res.status(401).json({message: 'Unauthorized access'})
            })
        }else{
            res.status(401).json({message: 'Unauthorized access'})   
        }
    })
}

//Handling resetting of the password of the logged in user by checking the id of the user through the token 
//sent by the request header in which also pass through the check-auth middleware before coming here.
changePassword = (req, res) => {
    //get user id based on login user provided token
    const userId = req.authData._id;

    //get old and new password from the request body
    const oldPassword = req.body.oldPassword
    const  newPassword  = req.body.newPassword

    //find user with that id
    User.findOne({_id: userId})
        .then( user => {
            //compare if old password is equal to the found user in house password
            var compareHash = bcrypt.compareSync(oldPassword, user.password);
            //if yes then update
            if(compareHash){
                let hash = bcrypt.hashSync(newPassword, 10)
                User.findOneAndUpdate({_id: userId}, {password: hash})
                .then(() => res.status(200).json({message: 'Password change Successful'}))
                .catch( err => res.status(500).json(err))
            } else {
                res.status(401).json({message: 'Old password dosen\'t match'})
            }
        })
        .catch(() => {
            res.status(401).json({message: 'Unauthorized access'})
        })
}

//pic-profile-update
uploadAvatar = (req, res) => {
    const uID = req.authData._id;
    if (!req.file){
        res.status(400).json({
            message: 'Please select an image for upload'
        })
    }

    else if (req.fileValidationError) {
        res.status(400).json({
            message: req.fileValidationError
        })
    }
    else {
         User.findOneAndUpdate({_id: uID}, {
            avatar: req.file
        }).then(() =>
            res.status(200).json({
                message: 'Upload successful',
                file: req.file.filename
            })
        )
    }
}

//Handle profile updating of each user
updateProfile = (req, res) => {
    const uID = req.authData._id;
    User.findOneAndUpdate({_id: uID}, {
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        age: req.body.age
    })
    .then(() => res.status(200).json({message: 'User profile updated successfully'}))
    .catch(err => { res.status(500).json(err) })
}

module.exports = {
    signup,
	login,
    me,
    sendPasswordresetLink,
    resetPassword,
    changePassword,
    updateProfile,  
    uploadAvatar,
}