const express = require('express')
	, router = express.Router()
	, CONSTANTS = require('./../configs/constants')
	;

let customerController,
	authController;

function loadRoutes() {
	router.use('/', authController.authorizeRole(CONSTANTS.ROLES.CUSTOMER));
	router.get('/questions', customerController.fetchQuestions);
	router.post('/updateScore', customerController.updateScore);
	router.post('/applyPromoCode', customerController.applyPromoCode);
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	customerController = require('./../api/controllers/CustomerController')(cfg);
	authController = require('./../api/controllers/AuthController')(cfg);
	loadRoutes();
	return router;
};
