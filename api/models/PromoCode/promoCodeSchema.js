const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONSTANTS = require('./../../../configs/constants');

module.exports = new Schema({
	name: String,
	startDate: Number,
	endDate: Number,
	points: Number,
	valid: {
		type: String,
		enum: [CONSTANTS.PROMO_CODES.VALID_FOR.DAILY, CONSTANTS.PROMO_CODES.VALID_FOR.ONCE],
		default: CONSTANTS.PROMO_CODES.VALID_FOR.DAILY
	}
}, {
	timestamps: true
	, collection: 'promoCodes'
});