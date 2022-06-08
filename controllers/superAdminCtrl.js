//Import users database schema
const User =  require('../models/userModel');

//Import staff level collection schema
const StaffLevel =  require('../models/staffLevelModel');

//Let super admin get all users (PROTECTED)
getAllUsers = (req, res) => {
    if(req.authData.isSuperAdmin){
        User.find().select('firstname lastname username email age date_of_birth regDate regTime isLearner isInstructor isSuperAdmin isSuspended isStaffStatus status avatar.path staffLevelStatus _id').then(
        docs => {
            const response = {
                count: docs.length,
                data: docs.map(doc => {
                    return {
                        _id: doc._id,
                        firstname: doc.firstname,
                        lastname: doc.lastname,
                        username: doc.username,
                        email: doc.email,
                        age: doc.age,
                        date_of_birth: doc.date_of_birth,
                        regDate: doc.regDate,
                        regTime: doc.regTime,
                        isLearner:doc.isLearner,
                        isInstructor: doc.isInstructor,
                        isSuperAdmin: doc.isSuperAdmin,
                        isStaffStatus: doc.isStaffStatus,
                        isSuspended: doc.isSuspended,
                        staffLevelStatus: doc.staffLevelStatus,
                        status: doc.status,
                        avatar: doc.avatar,
                        request: {
                            type: 'GET',
                            url: 'http://'+req.headers.host+'/superAdmin/getOneUser/'+doc._id
                        }
                    }
                })
            }
        res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        });
    } else {
        res.status(500).json({
            message: "Permission denied!"
        })
    }
}

//Get one user details to b viewed by the super admin
getOneUser = (req, res) => {
    if(req.authData.isSuperAdmin){
    const uID = req.params.userId;
        User.findById(uID).select('firstname lastname username email age date_of_birth regDate regTime isLearner isInstructor isSuperAdmin isSuspended isStaffStatus status avatar.path staffLevelStatus _id').then(
            result => {
            res.status(200).json({
                result: result,
                request: {
                    type: "GET",
                    url: 'http://'+req.headers.host+'/superAdmin/allusers'
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                err,
            })
        })
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}

//Let super admin delete a specific user (PROTECTED)
deactivateOneUser = (req, res) => {
    if(req.authData.isSuperAdmin){
        const uID = req.params.userId;
        User.findOneAndUpdate({_id: uID}, {
            status: 'archived'
        })
        .then( result => {
            if(result.deletedCount > 0){
                res.status(200).json({
                    message: "User archived successfully",
                    request: {
                        type: 'POST',
                        url: 'http://'+req.headers.host+'auth/signup',
                        body : {
                            firstname: 'firstname',
                            lastname: 'lastname',
                            username: 'username',
                            age: 'age',
                            email: 'email',
                            password: 'password',
                        }
                    }
                })
            }else{
                res.status(422).json({
                    message: "User not found",
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                err,
            })
        })
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}

//Let Super Admin register staffs
registerStaff = (req, res) => {

}

//let Super Admin and the authorized staff accept instructors
acceptInstructors = (req, res) => {
     if(req.authData.isSuperAdmin){
        const uID = req.params.userId;
        User.findOneAndUpdate({_id: uID}, {
            isInstructor: true
        })
        .then(() => res.status(200).json({message: 'Instructor status added successfully'}))
        .catch(err => { res.status(500).json(err) })
    }
} 
//let super admin suspend active staff
suspendOneStaff = (req, res) => {
    if(req.authData.isSuperAdmin){
        const uID = req.params.userId;
        User.findOneAndUpdate({_id: uID}, {
            isSuspended: true
        })
        .then(() => res.status(200).json({message: 'User suspended successfully'}))
        .catch(err => { res.status(500).json(err) })
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}

suspendStaffLevel = (req, res) => {
    if(req.authData.isSuperAdmin){
        const id = req.params.level_id;
        StaffLevel.findOneAndUpdate({_id: id},{
            status: 'archived'
        })
        .then(() => {
            res.status(200).json({message: 'Staff level suspended successfully'})
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        });
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}

reactivateStaffLevel = (req, res) => {
    if(req.authData.isSuperAdmin){
        const id = req.params.level_id;
        StaffLevel.findOneAndUpdate({_id: id},{
            status: 'active'
        })
        .then(() => {
            res.status(200).json({message: 'Staff level re-activated successfully'})
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        });
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}

addStaffLevel = (req, res) => {
    if(req.authData.isSuperAdmin){
        StaffLevel.findOne({ title: req.body.title }).then(level => {
            if(level.title == req.body.title){
                res.status(400).json({
                    message: 'This staff title/level already existed'
                })
            }
        })
        const newStaffLevel = new StaffLevel({
            title: req.body.title,
            description: reg.body.description
        })
        newStaffLevel.save()
        .then(() => {
            res.status(200).json({message: 'Staff level re-activated successfully'})
        })
        .catch(error => {
            res.status(500).json({
                error,
            })
        });
    } else {
        res.status(500).json({
            message: "Permission denied"
        })
    }
}
module.exports = {
	getAllUsers,
    getOneUser,
	deactivateOneUser,
    registerStaff,
    acceptInstructors,
    suspendOneStaff,
    suspendStaffLevel,
    reactivateStaffLevel,
    addStaffLevel
}