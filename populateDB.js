//Import express web framework for node.js
const mongoose = require('mongoose')

//Import bcrypt to hash password
const bcrypt = require('bcryptjs');

//Import the databse connection module
const dbCon = require('./dbcon/dbcon')

//Import users database schema
const Staff =  require('./models/staffLevelModel');

//Import users database schema
const CourseCat =  require('./models/courseCategoryModel');

//Import users database schema
const User =  require('./models/userModel');

const superAdmin = [
	{
		firstname: "Super",
		lastname: "Admin",
		username: "supadmin",
		age: "25",
		email: "superadmin@flesktechnology.com",
		password: bcrypt.hashSync("flesksuperadmin", 10),
		isInstructor: true,
		isSuperAdmin: true,
	}
]

const staffs = [
	{
		title: "developers",
		description: "developers of this platfrom",
		status: "active",
	},
	{
		title: "data analyst",
		description: "data analyst of this platfrom",
		status: "active",
	},
	{
		title: "accountant",
		description: "accountant of this platfrom",
		status: "active",
	},
	{
		title: "admission officer",
		description: "admission officer of this platfrom",
		status: "active",
	},
	{
		title: "content developer",
		description: "content developer of this platfrom",
		status: "active",
	},
	{
		title: "digital marketer",
		description: "digital marketer of this platfrom",
		status: "active",
	},
	{
		title: "education officer",
		description: "education officer of this platfrom",
		status: "active",
	},
];

const coursecats = [
	{
		title: "robotics",
		description: "robotics technology courses offered by this platfrom",
		status: "active",
	},
	{
		title: "artificial intelligence",
		description: "artificial intelligence technology courses offered by this platfrom",
		status: "active",
	},
]

function seedStaffs(){
	console.log('Seeding staffs into db');
	staffs.map(data => {
	  	// Initialize a model with staff data
	  	const staff = new Staff(data);
	  	// and save it into the database
	  	staff.save();
	});
	console.log('Seeding successful')
}

function seedCoursecats() {
	console.log('Seeding course category into db');
	coursecats.map(data => {
	  	// Initialize a model with staff data
	  	const corcat = new CourseCat(data);
	  	// and save it into the database
	  	corcat.save();
	});	
	console.log('Seeding successful')
}

function seedSuperAdmin() {
	console.log('Seeding csuper admin details into db');
	superAdmin.map(data => {
	  	// Initialize a model with staff data
	  	const sup = new User(data);
	  	// and save it into the database
	  	sup.save();
	});	
	console.log('Seeding successful')
}

seedStaffs();
seedCoursecats();
seedSuperAdmin();
