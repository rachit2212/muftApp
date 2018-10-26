const express = require('express')
	, router = express.Router()
	;

let authController;

function loadRoutes() {
	router.post('/signup', authController.signUp);
	router.post('/login', authController.login);
	router.post('/changePassword', authController.changePassword);
	router.get('/uniqueUsername', authController.uniqueUsername)
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	authController = require('./../api/controllers/AuthController')(cfg);
	loadRoutes();
	return router;
};
