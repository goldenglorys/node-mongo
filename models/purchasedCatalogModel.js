//Import express web framework for node.js
const mongoose = require('mongoose')

//Declare the mongoose Schema
const Schema = mongoose.Schema

// Construct the Purchased Courses Catalog Schema 
const CatalogSchema = new Schema(
    {
	    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
	    courses: [
	    	new Schema({
	    		course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CourseDetail' },
	    		transaction_ref: { type: String, required: true, ref: 'Rave' }, 
	    		status: {type: String, lowercase: true, default: 'active'},
	    	})
	   	]
    },
    { timestamps: true },
)

//Export the module for use in other modules
module.exports = mongoose.model('PurchasedCatalog', CatalogSchema)