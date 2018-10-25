
const CONSTANTS = require('./../../configs/constants'),
	moment = require('moment');

let models;

const createQuestion = (options = {}, cb) => {
	const query = {
		category: options.category
		, 'timeRange.start': { $gte: options.timeRange.start }
		, 'timeRange.end': { $lte: options.timeRange.end }
	}
	
	models.questions.find(query).lean().exec((err, questions) => {
		if (err) {
			return cb(err);
		}
		if (questions && questions.length === CONSTANTS.QUIZ_CATEGORY[options.category].LIMIT) {
			return cb({ error_message: `Max limit of ${ questions.length } reached for this category` });
		}
		const questionModel = new models.questions(options);
		questionModel.save(cb);
	})
}

const deleteQuestion = (questionId, cb) => {
	models.questions.remove({ _id: questionId }).exec(cb);
}

const fetchQuestions = (date, cb) => {
	const query = {
		'timeRange.start': moment(date).startOf('day').toDate().getTime()
	}
	models.questions.find(query).lean().exec(cb);
}

const createPromoCode = (options = {}, cb) => {
	options.startDate = moment(options.startDate).startOf('day').toDate().getTime();
	options.endDate = moment(options.endDate).endOf('day').toDate().getTime();
	
	const query = {
		name: options.name
	}

	models.promoCodes.findOne(query).exec((err, promoCode) => {
		if (err) {
			return cb(err);
		}
		if (promoCode) {
			promoCode.startDate = options.startDate;
			promoCode.endDate = options.endDate;
			promoCode.points = options.points;
			if (options.valid) {
				promoCode.valid = options.valid;
			}
			promoCode.save(cb);
		} else {
			const promoModel = new models.promoCodes(options);
			promoModel.save(cb);
		}
	})
}

const deletePromoCode = (promoId, cb) => {
	models.promoCodes.remove({ _id: promoId }).exec(cb);
}

const fetchPromoCodes = (options, cb) => {
	const query = {
		startDate: { $gte: moment(options.startDate).startOf('day').toDate().getTime() },
		endDate: { $lte: moment(options.endDate).endOf('day').toDate().getTime() }
	}
	models.promoCodes.find(query).lean().exec(cb);
}

const adminService = {
	fetchQuestions,
	createQuestion,
	deleteQuestion,
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
	
	return adminService;
};