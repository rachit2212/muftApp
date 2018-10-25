const respond = require('./../../utils/respond'),
	CONSTANTS = require('./../../configs/constants'),
	utilities = require('./../../utils/utilities'),
	moment = require('moment');

let adminService,
	productService;

const createQuestion = (req, res) => {
	const payload = req.body;

	if (!payload.category || !CONSTANTS.QUIZ_CATEGORY[payload.category]
		|| ['SELFI_MISSION', 'WATCH_MISSION'].indexOf(payload.category) > -1) {
		return respond.send400(req, res, { error_message: 'Invalid question category' })
	}

	if (payload.category !== 'SOCIAL_MISSION') {
		if (!payload.questionText || !Array.isArray(payload.options) || !payload.correctOption) {
			return respond.send400(req, res);
		}
	} else {
		if (!payload.pageTitle || !utilities.isValidUrl(payload.socialPageUrl)) {
			return respond.send400(req, res);
		}
	}

	payload.timeRange = payload.timeRange || {};
	if (payload.timeRange.start) {
		payload.timeRange.start = moment(payload.timeRange.start).startOf('day').toDate().getTime();
	} else {
		payload.timeRange.start = moment().startOf('day').toDate().getTime();
	}
	if (payload.timeRange.end) {
		payload.timeRange.end = moment(payload.timeRange.end).endOf('day').toDate().getTime();
	} else {
		payload.timeRange.end = moment().endOf('day').toDate().getTime();
	}

	adminService.createQuestion(payload, (err, ques) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { result: 'question created successfully', ques })
	})
}

const deleteQuestion = (req, res) => {
	const questionId = req.body.questionId;
	if (!questionId) {
		return respond.send400(req, res);
	}

	adminService.deleteQuestion(questionId, err => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { result: 'question deleted successfully' })
	})
}

const fetchQuestions = (req, res) => {
	const date = req.query.date;
	
	if (!date) {
		return respond.send400(req, res);
	}
	
	adminService.fetchQuestions(date, (err, questions) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { data: questions })
	})
}

const addProduct = (req, res) => {
	const payload = req.body;
	if (!payload || !payload.name || !payload.buyingPoints || !payload.type || !payload.description) {
		return respond.send400(req, res);
	}
	payload.restockValue = payload.restockValue || false;
	
	productService.addProduct(payload, (err, product) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { data: product })
	})
}

const deleteProduct = (req, res) => {
	const productId = req.body.productId;
	if (!productId) {
		return respond.send400(req, res);
	}

	productService.deleteProduct(productId, err => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { result: 'product deleted successfully' })
	})
}

const setRestockValue = (req, res) => {
	const productId = req.body.productId;
	const payload = {
		restockValue: req.body.restockValue
	}
	
	if (payload.restockValue === undefined || payload.restockValue === null) {
		return respond.send400(req, res, { error_message: 'Need to pass restock value' })
	}
	
	if (productId) {
		payload.productId = productId;
	}

	productService.setRestockValue(payload, err => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { result: 'restock value updated successfully' })
	})
}

const fetchPromoCodes = (req, res) => {
	const payload = {
		startDate: req.query.startDate,
		endDate: req.query.endDate
	}

	if (!payload.startDate || !payload.endDate) {
		return respond.send400(req, res);
	}

	adminService.fetchPromoCodes(payload, (err, promoCodes) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { data: promoCodes })
	})
}

const createPromoCode = (req, res) => {
	const payload = req.body;
	if (!payload || !payload.name || !payload.startDate || !payload.endDate || !payload.points) {
		return respond.send400(req, res);
	}

	adminService.createPromoCode(payload, (err, promoCode) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { data: promoCode })
	})
}

const deletePromoCode = (req, res) => {
	const promoId = req.body.promoId;
	if (!promoId) {
		return respond.send400(req, res);
	}

	adminService.deletePromoCode(promoId, err => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { result: 'promo code deleted successfully' })
	})
}

const admin = {
	fetchQuestions,
	createQuestion,
	deleteQuestion,
	addProduct,
	deleteProduct,
	setRestockValue,
	fetchPromoCodes,
	createPromoCode,
	deletePromoCode
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
	adminService = require('./../services/AdminService')(cfg);
	productService = require('./../services/ProductService')(cfg);
	return admin;
};