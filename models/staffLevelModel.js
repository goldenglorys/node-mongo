//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

// Construct the staffSchema for how each document will look like in the database "Staffs" collection
const staffLevelSchema = new Schema(
    {
        title: {type: String, unique: true},
        description: String,
        status: {type: String, lowercase: true, default: 'active'},
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('StaffLevel', staffLevelSchema)