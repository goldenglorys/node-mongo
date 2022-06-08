//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

//Get the date and time here
const today = new Date;
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// Construct the userSchema for how each document will look like in the database "Users" collection
const userSchema = new Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        age: {type: Number, required: true, min: 15},
        date_of_birth: {type: String, required: true},
        username: {type: String, unique: true, required: true, lowercase: true},
        email: {type: String, unique: true, requiredd: true, lowercase: true, minlength: 5, maxlength: 255},
        password: {type: String, required: true},
        regDate: {type: String, default: date},
        regTime: {type: String, default:time},
        isLearner: {type: Boolean, default: true},
        isInstructor: {type: Boolean, default: false},
        isSuperAdmin: {type: Boolean, default: false},
        isStaffStatus: {type: String, default: 'inactive'},
        isSuspended: {type: Boolean, default: false},
        status: {type: String, lowercase: true, default: 'active'},
        staffLevelStatus: {type: mongoose.Schema.Types.ObjectId, default: null, ref: 'StaffLevel'},
        avatar: Object,
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('Users', userSchema)