//unirest is an http request library so any other preferred library can be used.
const unirest = require("unirest"); 

//Import users database schema
const Course =  require('../models/courseDetailsModel');

//Import rave collection schema
const Rave =  require('../models/raveModel');

//Import courses cataloging collection schema
const CourseCatalog =  require('../models/purchasedCatalogModel');

verifyPayment = (req, res) => {
	const txRef  = req.params.txref; 
	const course = req.params.course_id;
						       
	let payload = {
	  "SECKEY": process.env.RAVE_SK, //merchant secret key
	  "txref": txRef //this is the reference from the payment button response after customer paid.
	};

	let server_url = process.env.RAVE_URL; 

	//make a post request to the server endpoint using unirest.
	unirest.post(server_url)
      	.headers({'Content-Type': 'application/json'})
      	.send(payload)
      	.end((response) => {
  			if(response){
		        //check status is success and if the amount is same as amount you wanted to charge just to be very sure
		        if (response.body.data.status === "successful" && response.body.data.chargecode == 00) {
	              	Course.findOne({ _id: course, status: 'active' }).then( courseData => { 
	              		if(courseData){
	              			if (response.body.data.amount === parseInt(courseData.price)) {

	              				//keep track of each and every transaction made in the platfrom
			              		const raveData = new Rave({
			              			amount: courseData.price,
						            payment_reference: txRef,
						            paymentMadeBy: req.authData._id,
						            coursePaidFor: course,
						        });
						        raveData.save();

						        //cataloging each course paid for by every learners by appending to their 
						        //list of available courses
						        CourseCatalog.findOneAndUpdate({user_id: req.authData._id},
						        	{$push: {courses: {
						        		course_id: course,
						        		transaction_ref: txRef
						        	}}}
						        )
						        .then((catalogged) => {
						        	//If user have list of available courses, it append
						        	if(catalogged){
						        		 res.status(200).json({
								           	status: 'Successful',
								            message: 'Transaction Verified and course is available for you',
								        })
						        	}
						        	//Available courses are created if the user dosen't have any yet
						        	else {
						        		 const catalogData = new CourseCatalog({
								            user_id: req.authData._id,
								            courses: {
								            	course_id: course,
								            	transaction_ref: txRef
								            }
								        });
								        catalogData.save();
								        res.status(200).json({
								           	status: 'Successful',
								            message: 'Transaction Verified and course is available for you',
								        })
						        	}
						   		})
						        .catch(err => { 
						        	res.status(500).json({
						        		message: 'An error occured',
						        		error: err
						        	}) 
						        })
			              	}else {
			              		res.status(200).json({
						           	status: 'Unsuccessful',
						            message: 'Amount not equal, please contact the admin for next step',
						            response: response
						        })
			              	}
	              		}
	              		else{
	              			res.status(200).json({
					           	status: false,
					            message: 'Course not found',
					            response: response
					        })
	              		}
	              	}).catch(err => { res.status(500).json(err) });
	          	}
	          	else{
	          		res.status(200).json({
			           	status: 'Unsuccessful',
			            message: 'Transaction failed',
			            response: response
			        })
	          	}
			}
      	})
}

module.exports = {
	verifyPayment
}