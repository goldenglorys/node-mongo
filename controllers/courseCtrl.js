//Import users database schema
const Course =  require('../models/courseDetailsModel');

//Import users database schema
const CourseCategory =  require('../models/courseCategoryModel')

//Handling creation of courses JUST only by the user with the level of clearance required!
createCourse = (req, res) => {
	//Create if clearance (isSuperAdmin or staff is education officer)
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
			const by = req.authData._id;
			Course.findOne({ title: req.body.title, }).then(course => {
	            if(course){
	                res.status(400).json({
	                    message: 'Course title already exist'
	                })
	            }else{
	            	if (!req.file){
				        res.status(400).json({
				            message: 'Please select an image for upload'
				        })
				    }

				    if (req.fileValidationError) {
				        res.status(400).json({
				            message: req.fileValidationError
				        })
				    }
	            	const courseData = new Course({
			            title: req.body.title,
			            description: req.body.description,
			            price: req.body.price,
			            outline: req.body.outline,
			            linkToCoursePDF: req.body.linkToCoursePDF,
				        linkToCourseVideo: req.body.linkToCourseVideo,
				        instructors: [req.body.instructors],
				        duration: req.body.duration,
				        linkToTestBoard: req.body.linkToTestBoard,
				        linkToExam: req.body.linkToExam,
				        linkToCourseEvaluation: req.body.linkToCourseEvaluation,
				        createdBy: req.authData._id,
				        category: req.body.category_id
			        });
			        courseData.save()
			        .then(
			        saved => {
			        	User.findOneAndUpdate({_id: saved._id}, {
				            coverPicture: req.file
				        })
			            console.log("Saved to database with a unique ID of: " + saved._id)
			            res.status(200).json({
			                success: true,
			                id: saved._id,
			                message: 'Course created successfully!',
			            })
			        })
			        .catch(error => {
			            res.status(500).json({
			                error,
			            })
			        })
	            }
	        })
	    } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
        })
    }
}

//Handling creation of course categories if any is to be added JUST only by the user with the level of clearance required!
createCourseCategory = (req, res) => {
	//Create if clearance (isSuperAdmin or staff is education officer)
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
			CourseCategory.findOne({ title: req.body.title, }).then(course => {
	            if(course){
	                res.status(400).json({
	                    message: 'Course Category title already exist'
	                })
	            }else{
	            	const courseCategoryData = new CourseCategory({
			            title: req.body.title,
			            description: req.body.description,
				        createBy: req.authData._id
			        });
			        courseCategoryData.save()
			        .then(
			        saved => {
			            console.log("Saved to database with a unique ID of: " + saved._id)
			            res.status(200).json({
			                success: true,
			                id: saved._id,
			                message: 'Course category created successfully!',
			            })
			        })
			        .catch(error => {
			            res.status(500).json({
			                error,
			            })
			        })
	            }
	        })
	     } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
        })
    }
}

//Allow the cleared user to suspend an active course if they wanted
suspendCourse = (req, res) => {
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
	        const cID = req.params.course_id;
	        Course.findOneAndUpdate({_id: cID}, {
	            status: 'archived'
	        })
	        .then(() => res.status(200).json({message: 'Course suspended successfully'}))
	        .catch(err => { res.status(500).json(err) })
	    } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
        });
    }
}

//Allow the cleared user to re-activate a suspended course if they wanted
activateCourse = (req, res) => {
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
	        const cID = req.params.course_id;
	        Course.findOneAndUpdate({_id: cID}, {
	            status: 'active'
	        })
	        .then(() => res.status(200).json({message: 'Course re-activated successfully'}))
	        .catch(err => { res.status(500).json(err) })
	    } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
        });
    }
}

//Allow the cleared user to suspend an active course category if they wanted
suspendCourseCategory = (req, res) => {
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
	        const cID = req.params.coursecat_id;
	        CourseCategory.findOneAndUpdate({_id: cID}, {
	            status: 'archived'
	        })
	        .then(() => res.status(200).json({message: 'Course category suspended successfully'}))
	        .catch(err => { res.status(500).json(err) })
	    } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
      	});
    }
}

//Allow the cleared user to suspend an active course category if they wanted
activateCourseCategory = (req, res) => {
	if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer"){
		if(!req.authData.isSuspended){
	        const cID = req.params.coursecat_id;
	        CourseCategory.findOneAndUpdate({_id: cID}, {
	            status: 'active'
	        })
	        .then(() => res.status(200).json({message: 'Course category re-activated successfully'}))
	        .catch(err => { res.status(500).json(err) })
	    } else{
	    	 res.status(500).json({
	            message: "Permission denied, this account is suspended, contact admin for re-activtion"
	        })
	    }
	} else {
        res.status(500).json({
            message: "Permission denied!"
      	});
    }
}
module.exports = {
	createCourse,
	createCourseCategory,
	suspendCourse,
	activateCourse,
	suspendCourseCategory,
	activateCourseCategory
}	