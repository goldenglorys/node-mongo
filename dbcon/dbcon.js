//Import express web framework for node.js
const mongoose = require('mongoose')

//
require('dotenv').config()

//Declare promiseglobally to be used when connecting to the database
mongoose.Promise = global.Promise

//Here is the connection to the mongodb that's located locally
const DBURL = process.env.MONGO_URL;

//Remote mongodb connection "either of both can be use"
const MLABDBURL = process.env.MLAB_URL;

//Mongo connection code
mongoose.connect(MLABDBURL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
    .catch(err => {
        console.error('MongoDB connection error:', err.message)
    })

//Declare variable to be exported for other modules
const dbCon = mongoose.connection

module.exports = dbCon
