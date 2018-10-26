const respond = require('./../../utils/respond')
	, async = require('async')
	, utilities = require('./../../utils/utilities')
	;

let authService
	, models
	;

const login = (req, res) => {
	const password = req.body.password
		, userName = req.body.userName
		;

	if (!userName || !password) {
		return respond.send400(req, res);
	}
	
	const validateUser = cb => {
		authService.validateCredentials(userName, password, cb);
	}
	
	const generateToken = (user, cb) => {
		authService.generateToken(user, cb)
	}
	
	async
		.waterfall([
			validateUser
			, generateToken
		], (err, data) => {
			if(err) {
				return respond.send500(req, res, err)
			}
			respond.send200(req, res, data);
		})
}

const signUp = (req, res) => {
	const params = req.body;

	if(!params || !params.userName || !params.email || !params.password) {
		return respond.send400(req, res)
	}

	const signUpUser = cb => {
		authService.signUp(params, cb);
	}

	const generateToken = (user, cb) => {
		authService.generateToken(user, cb)
	}

	async
		.waterfall([
			signUpUser
			, generateToken
		], (err, data) => {
			if(err) {
				return respond.send500(req, res, err)
			}
			respond.send200(req, res, data);
		})
}

const uniqueUsername = (req, res) => {
	const userName = req.query.userName;
	if (!userName) {
		return respond.send400(req, res);
	}
	
	models.users.findOne({
		userName
	}, (err, user) => {
		if(err) {
			return respond.send500(req, res, err)
		}
		respond.send200(req, res, { userNameExists: user ? false : true })
	})
}

const authenticate = (req, res, next) => {
	const token = utilities.getAuthToken(req);
	if (!token) {
		return respond.send401(req, res, { error_message: 'Token not present' });
	}
	authService.validateToken(token, (err, userObj) => {
		if (err) {
			if (err === 'token expired') {
				err = {
					error_message: 'Session has expired. Please login again using your API Key'
					, error_code: 'TOKEN_EXPIRED'
				}
			} else {
				err = { error_message: err || 'some error occurred' }
			}
			return respond.send401(req, res, err);
		}
		req.user = userObj;
		next();
	})
}

const authorizeRole = (roles) => {
	roles = typeof roles === 'undefined' ? [] : typeof roles === 'string' ? [roles] : roles;
	return function(req, res, next) {
		if (req.user && (roles.indexOf(req.user.role) > -1 || roles[0] === 'all')) {
			next();
		} else {
			respond.send401(req, res);
		}
	};
};

const changePassword = (req, res) => {
	const params = req.body;

	if(!params || !params.userName || !params.oldPassword || !params.newPassword) {
		return respond.send400(req, res);
	}

	authService.changePassword(params, (err, result) => {
		if(err) {
			return respond.send500(req, res, { error_message: err })
		}
		respond.send200(req, res, result);
	})
}

const auth = {
	login
	, signUp
	, uniqueUsername
	, authorizeRole
	, authenticate
	, changePassword
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	models = cfg.models;
	authService = require('./../services/AuthService')(cfg);
	return auth;
};