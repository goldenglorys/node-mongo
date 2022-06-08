//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

//Get the date and time here
const today = new Date;
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// Construct the staffSchema for how each document will look like in the database "Staffs" collection
const courseDetailSchema = new Schema(
    {
        title: {type: String, unique: true},
        description: String,
        coverPicture: Object,
        price: Number,
        outline: String,
        linkToCoursePDF: String,
        linkToCourseVideo: String,
        instructors: [String],
        duration: String,
        linkToTestBoard: {type: mongoose.Schema.Types.ObjectId, ref: 'TestQuestions'},
        linkToExam: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamQuestions'},
        linkToCourseEvaluation: String,
        status: {type: String, lowercase: true, default: 'active'},
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory'},
        regDate: {type: String, default: date},
        regTime: {type: String, default:time},
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('CourseDetail', courseDetailSchema)