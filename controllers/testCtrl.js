//Import test questions database schema
const TestQuestion =  require('../models/testQuestionModel');

//Import users database schema
const Course =  require('../models/courseDetailsModel')

addTestQuestion = (req, res) => {
    if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer") {
        if(!req.authData.isSuspended){
            const course_id = req.body.course_id
            const userId = req.authData._id

            if(course_id){
                const quest = new TestQuestion({
                    question: req.body.question,
                    options: { 
                        optionA: req.body.optionA,
                        optionB: req.body.optionB,
                        optionC: req.body.optionC,
                        optionD: req.body.optionD,            
                    },
                    answerKey: req.body.answerKey,
                    courseID: course_id,
                    addedBy: userId
                })

                //save the question to the collection
                quest.save()
                    .then( saved => {

                        //Updaate course collection with the test id of the course
                        Course.findOneAndUpdate({_id: course_id}, {
                            linkToTestBoard: saved._id,
                        })

                        res.status(200).json({
                            success: true,
                            id: saved._id,
                            message: 'Question saved successfully!',
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            error,
                        })

                    })
            }

            else {
                res.status(402).json({
                    message: 'No course selected'
                })
            }
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

updateTestQuestion = (req, res) => {
    if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer") {
        if(!req.authData.isSuspended){
        const questionId = req.body.question_id

        TestQuestion.findOneAndUpdate({_id: questionId},
            {
                question: req.body.question,
                    options: { 
                        optionA: req.body.optionA,
                        optionB: req.body.optionB,
                        optionC: req.body.optionC,
                        optionD: req.body.optionD,            
                    },
                    answerKey: req.body.answerKey,
            })
            .then(() => res.status(200).json({message: 'Your question was updated successfully'}))
            .catch(err => { res.status(500).json(err) })
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

suspendTestQuestion = (req, res) => {
    if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer") {
        if(!req.authData.isSuspended){
            const questionId = req.params.question_id

            TestQuestion.findOneAndUpdate({_id: questionId}, {
                status: 'archived'
            })
            .then(() => res.status(200).json({
                message: 'Archived Successfully'
            }))
            .catch(error => res.status(500).json(error))
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

activateTestQuestion = (req, res) => {
    if(req.authData.isSuperAdmin || req.authData.staffLevelStatus == "education officer") {
        if(!req.authData.isSuspended){
            const questionId = req.params.question_id

            TestQuestion.findOneAndUpdate({_id: questionId}, {
                status: 'active'
            })
            .then(() => res.status(200).json({
                message: 'Re-activated Successfully'
            }))
            .catch(error => res.status(500).json(error))
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

getTestQuestions = (req, res) => {
    const course_id = req.params.courseId

    //Get the first ten questions 
    TestQuestion.find({courseId: course_id, status: 'active'}, {courseId: 0}).limit(10)
    .then(questions => {
        shuffledQuestion = shuffle(questions)
        res.status(200).json({
            shuffledQuestion
        })
    })
    .catch(error => res.status(500).json(error))
}


shuffle = (arr) => {
    let curIndex = arr.length
    let tempValue
    let randomIndex

    //Loop through the array while we have elements or items
    while (curIndex > 0) {
        //Pick a random index
        randomIndex = Math.floor(Math.random() * curIndex)

        //decrease the length of the array/index
        curIndex--

        //swap the current element/item with it
        tempValue = arr[curIndex]
        arr[curIndex] = arr[randomIndex]
        arr[randomIndex] = tempValue
    }

    return arr
}

module.exports = {
    addTestQuestion,
    updateTestQuestion,
    getTestQuestions,
    suspendTestQuestion,
    activateTestQuestion
}