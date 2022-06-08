//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

// Construct the userSchema for how each document will look like in the database "Users" collection
const forgotSchema = new Schema(
    {
        email:{type: String, required: true},
        resetPasswordToken:{type: String, required: true},
        resetPasswordExpires:{type: String, default: Date.now() + 900000} //expires in 15 minutes,
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('passwordReset', forgotSchema)