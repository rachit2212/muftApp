const jwtSimple = require('jwt-simple')
	, CONSTANTS = require('./../../configs/constants')
	;

let config
	, models
	;

const generateToken = (user, cb) => {
	const expires = new Date().getTime() + (config.TOKEN_EXPIRY_TIME || (3 * 24 * 60 * 60 * 1000));

	// create jwt payload
	const payload = {
		username: user.userName
		, email: user.email
		, role: user.role
		, exp: expires
		, iss: 'muft'
		, dateCreated: new Date().getTime()
	};

	const jwtToken = jwtSimple.encode(payload, config.JWT_SECRET);
	const userData = {
		jwtToken
		, userName: user.userName
		, email: user.email
		, score: user.score || 0
		, role: user.role
	}
	cb(null, userData);
}

const validateCredentials = (userName, password, cb) => {
	if (userName === CONSTANTS.ADMIN.USER_NAME) {
		if (password !== CONSTANTS.ADMIN.PASSWORD) {
			return cb({
				error_message: 'Incorrect username or password.'
			});
		}
		
		const userObj = {
			userName : CONSTANTS.ADMIN.USER_NAME
			, email : 'admin@muft.com'
			, role: CONSTANTS.ROLES.ADMIN
		}
		return cb(null, userObj);
	}
	
	models.users.findOne({
		userName
	}).exec(function(err, user) {
		if (err) {
			return cb(err);
		}
		if (!user || !user.comparePassword(password)) {
			return cb({
				error_message: 'Incorrect username or password.'
			});
		}
		user = user.toJSON();
		const userObj = {
			userName : user.userName
			, email : user.email
			, score: user.score || 0
			, role: CONSTANTS.ROLES.CUSTOMER
		}
		return cb(null, userObj);
	});
}

const signUp = (params, cb) => {
	let user = new models.users({
		userName: params.userName
		, email: params.email
		, password: params.password
		, role: CONSTANTS.ROLES.CUSTOMER
		, dateCreated: new Date()
	});
	
	user.save((err, userData) => {
		if(err) {
			return cb(err)
		}
		userData = userData.toJSON();
		const userObj = {
			userName : userData.userName
			, score: 0
			, email : userData.email
			, role: CONSTANTS.ROLES.CUSTOMER
		}
		return cb(null, userObj);
		cb(null, userObj);
	});
}

const validateToken = (token, cb) => {
	const decodedObj = jwtSimple.decode(token, config.JWT_SECRET);
	if (decodedObj && decodedObj.iss === 'muft'
		&& decodedObj.username) {
		if (decodedObj.exp > new Date().getTime()) {
			cb(null, decodedObj);
		} else {
			cb('token expired')
		}
	} else {
		cb('invalid token');
	}
}

const authService = {
	validateCredentials
	, generateToken
	, signUp
	, validateToken
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	config = cfg.config;
	models = cfg.models;

	return authService;
};