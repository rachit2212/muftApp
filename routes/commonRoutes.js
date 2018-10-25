const express = require('express')
	, router = express.Router()
	, CONSTANTS = require('./../configs/constants')
	;

let commonController,
	authController;

function loadRoutes() {
	router.use('/', authController.authorizeRole([CONSTANTS.ROLES.CUSTOMER, CONSTANTS.ROLES.ADMIN]));
	router.get('/products', commonController.fetchProducts);
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	commonController = require('./../api/controllers/CommonController')(cfg);
	authController = require('./../api/controllers/AuthController')(cfg);
	loadRoutes();
	return router;
};
