const respond = require('./../../utils/respond'),
	CONSTANTS = require('./../../configs/constants'),
	async = require('async');

let customerService;

const fetchQuestions = (req, res) => {
	const category = req.query.category;
	if (!category || !CONSTANTS.QUIZ_CATEGORY[category] || ['SELFI_MISSION', 'WATCH_MISSION'].indexOf(category) > -1) {
		return respond.send400(req, res);
	}
	
	const payload = {
		category ,
		username: req.user.username
	}

	const fetchQuestions = cb => customerService.fetchQuestions(category, cb);
	const fetchUserAnsweredQues = cb => customerService.fetchAnsweredQuestions(payload, cb);

	const parallelTasks = [];
	parallelTasks.push(fetchQuestions);
	parallelTasks.push(fetchUserAnsweredQues);

	async
		.parallel(parallelTasks, (err, results) => {
			if (err) {
				return respond.send500(req, res, err);
			}
			const questions = results[0];
			if (questions.length && results[1].length) {
				for(let index = 0; index < results[1].length; index++) {
					(questions.find(q => q._id == results[1][index].questionId) || {}).isAnswered = true;
				}
			}
			respond.send200(req, res, { data: questions });
		})
}

const updateScore = (req, res) => {
	const pointsGained = req.body.pointsGained;
	const questionId = req.body.questionId;
	const category = req.body.category;
	
	if (!pointsGained || !questionId || !category || !CONSTANTS.QUIZ_CATEGORY[category]) {
		return respond.send400(req, res);
	}

	const payload = {
		pointsGained
		, questionId
		, category
		, username: req.user.username
	}

	const addAnsweredQuestion = cb => customerService.addAnsweredQuestion(payload, cb);
	const updateScore = cb => customerService.updateScore(payload, cb);

	const waterfallTasks = [];
	if (['SELFI_MISSION', 'WATCH_MISSION'].indexOf(category) === -1) {
		waterfallTasks.push(addAnsweredQuestion);
	}
	waterfallTasks.push(updateScore);

	async
		.waterfall(waterfallTasks, (err, score) => {
			if (err) {
				return respond.send500(req, res, err);
			}
			return respond.send200(req, res, { status: 'score updated successfully', score })
		})
}

const applyPromoCode = (req, res) => {
	const promoText = req.body.promoText;
	if (!promoText) {
		return respond.send400(req, res);
	}

	const fetchPromoObject = cb => customerService.fetchPromoObject(promoText, cb);
	const applyPromoCode = (promoObj, cb) => customerService.applyPromoCode(
		{ username: req.user.username,  promo: { ...promoObj } }, cb);

	const waterfallTasks = [];
	waterfallTasks.push(fetchPromoObject);
	waterfallTasks.push(applyPromoCode);

	async
		.waterfall(waterfallTasks, (err, score) => {
			if (err) {
				return respond.send500(req, res, err);
			}
			return respond.send200(req, res, { status: 'promo code applied successfully', score })
		})
}

const customer = {
	fetchQuestions
	, updateScore
	, applyPromoCode
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
	customerService = require('./../services/CustomerService')(cfg);
	return customer;
};
