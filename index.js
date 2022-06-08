require('dotenv').config()

//Import express web framework for node.js
const express = require('express')

//Import cors for cross origin access to the apis routes
const cors = require('cors')

//Import body-parser for parsing incoming request bodies in a middleware before your handlers
const bodyParser = require('body-parser')

//Import the databse connection module
const dbCon = require('./dbcon/dbcon')

//Import the routes module for Super Admin
const authRoutes = require('./api/auth-routes')

//Import the routes module for the learners
const learnerRoutes = require('./api/learners-routes')

//Import the routes module for Super Admin
const superAdminRoutes = require('./api/superAdmin-routes')

//Import the routes module for the learners
const courseRoutes = require('./api/course-routes')

//Import the routes module for the public access
const publicRoutes = require('./api/public-routes')

//Import the routes module for test board questions
const testRoutes = require('./api/test-routes')

//Import the routes module for exam questions
const examRoutes = require('./api/exam-routes')

//Import the routes module for RAVE PAYMENT
const raveRoutes = require('./api/rave-routes')

//Set PORT to be connected to if not available in the .env default one will be used
const apiPort = process.env.PORT || 4001	

//Declare express
const app = express()

//Use bodyparser to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))

//Static directory to save and serve our uploaded files
app.use(express.static(__dirname + '/public'));

//Check the database connection
dbCon.once('open', () => console.log('MongoDB connection established!'))

//Use cors
app.use(cors())

//Use bodyparser to parse application/json
app.use(bodyParser.json())

//Set the routes for the auth
app.use('/auth', authRoutes)

//Set the routes for the learners according to their imported routes api
app.use('/users', learnerRoutes)

//Set the routes for the learners according to their imported routes api
app.use('/superadmin', superAdminRoutes)

//Set the routes for course according to their imported routes api
app.use('/course', courseRoutes)

//Set the routes for course according to their imported routes api
app.use('/publicaccess', publicRoutes)

//Set the routes for course according to their imported routes api
app.use('/testquestions', testRoutes)

//Set the routes for course according to their imported routes api
app.use('/examquestions', examRoutes)

//Set the routes for rave payment
app.use('/payment', raveRoutes)

//Start listening to the app port to handle request
app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`)
})