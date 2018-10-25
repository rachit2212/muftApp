const express = require('express')
	, router = express.Router()
	, CONSTANTS = require('./../configs/constants')
	;

let adminController,
	authController;

function loadRoutes() {
	router.use('/', authController.authorizeRole(CONSTANTS.ROLES.ADMIN));
	router.get('/question', adminController.fetchQuestions);
	router.post('/question', adminController.createQuestion);
	router.delete('/question', adminController.deleteQuestion);
	router.post('/product', adminController.addProduct);
	router.delete('/product', adminController.deleteProduct);
	router.post('/product/restock', adminController.setRestockValue);
	router.get('/promoCode', adminController.fetchPromoCodes);
	router.post('/promoCode', adminController.createPromoCode);
	router.delete('/promoCode', adminController.deletePromoCode);
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	adminController = require('./../api/controllers/AdminController')(cfg);
	authController = require('./../api/controllers/AuthController')(cfg);
	loadRoutes();
	return router;
};
