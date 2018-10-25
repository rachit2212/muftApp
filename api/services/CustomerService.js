
const moment = require('moment'),
	CONSTANTS = require('./../../configs/constants');

let models;

const fetchQuestions = (category, cb) => {
	const query = {
		category
		, 'timeRange.start': { $gte: moment().startOf('day').toDate().getTime() }
		, 'timeRange.end': { $lte: moment().endOf('day').toDate().getTime() }
	}

	models.questions.find(query).lean().exec(cb);
}

const fetchAnsweredQuestions = (payload, cb) => {
	const query = {
		username: payload.username
		, category: payload.category
		, date: {
			$gte: moment().startOf('day').toDate().getTime(),
			$lte: moment().endOf('day').toDate().getTime()
		}
	}
	models.answeredQuestions.find(query).lean().exec(cb);
}

const updateScore = (payload, cb) => {
	models.users.findOne({ userName: payload.username }).exec((err, userObj) => {
		if (err) {
			return cb(err);
		}
		userObj.score = userObj.score || 0;
		userObj.score += payload.pointsGained;
		userObj.save((err, updatedUser) => {
			if (err) {
				return cb(err);
			}
			cb(null, updatedUser.score);
		});
	})
}

const addAnsweredQuestion = (payload, cb) => {
	const query = {
		username: payload.username
		, category: payload.category
		, date: {
			$gte: moment().startOf('day').toDate().getTime(),
			$lte: moment().endOf('day').toDate().getTime()
		}
	}

	models.answeredQuestions.findOne(query).lean().exec((err, ansQues) => {
		if (err) {
			return cb(err);
		}
		if (ansQues) {
			return cb({ error_message: 'User has already answered this question' });
		}
		const ansQuestion = new models.answeredQuestions({
			questionId: payload.questionId
			, category: payload.category
			, username: payload.username
			, date: moment().toDate().getTime()
		})

		ansQuestion.save(err => cb(err));
	})
}

const fetchPromoObject = (promoText, cb) => {
	const currentTime = moment().toDate().getTime()
	models.promoCodes.findOne({ name: promoText }).lean().exec((err, promoObj) => {
		if (err) {
			return cb(err);
		} else if (!promoObj) {
			return cb({ error_message: 'invalid promo code' })
		} else if (promoObj.startDate > currentTime) {
			return cb({ error_message: 'promo code not yet active' })
		} else if (promoObj.endDate < currentTime) {
			return cb({ error_message: 'promo code expired' })
		}
		return cb(null, promoObj);
	})
}

const applyPromoCode = (payload, cb) => {
	models.users.findOne({ userName: payload.username }).exec((err, userObj) => {
		if (err || !userObj) {
			return cb(err || { error_message: 'User not found' });
		}
		if (userObj.promoCode && userObj.promoCode.text === payload.promo.name) {
			if (payload.promo.valid === CONSTANTS.PROMO_CODES.VALID_FOR.ONCE) {
				return cb({ error_message: 'promo code already applied earlier' });
			} else if (userObj.promoCode.appliedOn >= moment().startOf('day').toDate().getTime()
				&& userObj.promoCode.appliedOn <= moment().endOf('day').toDate().getTime()) {
				return cb({error_message: 'promo code already applied for today'});
			}
		}
		userObj.score = userObj.score || 0;
		userObj.score += payload.promo.points;
		userObj.promoCode = {
			text: payload.promo.name
			, appliedOn: moment().toDate().getTime()
		}
		userObj.save((err, updatedUser) => {
			if (err) {
				return cb(err);
			}
			cb(null, updatedUser.score);
		});
	})
}

const customerService = {
	fetchQuestions
	, fetchAnsweredQuestions
	, updateScore
	, addAnsweredQuestion
	, fetchPromoObject
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

	return customerService;
};