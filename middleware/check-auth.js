//Import jsonwebtoken to generate token when user login for authentication
const jwt = require("jsonwebtoken");

//Export to be used by other module
module.exports = (req, res, next) => {

	if(!req.headers.authorization) {
		res.status(400).json({
			message: "Token is empty in the request headers"
		});
	} else {
		//Collect token from the request headers Authorization bearer and split to get only the token 
		const token = req.headers.authorization.split(' ')[1];

		//Verify collected token and decode to get all hidden info in it
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.authData = decoded;	
			next();		
		} catch (error) {
			//Return error if it dosent get token or token is expired and other...
			return res.status(401).json({
				error,
				message: "Authentication failed"
			});
		};
	};
};