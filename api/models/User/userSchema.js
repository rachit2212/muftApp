const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	userName: {
		type: String,
		required: true,
		unique: true
	}
	, role: {
		type: String
		, required: true
	}
	, mobile: String
	, email: {
		type: String
		, unique: true
	}
	, dateCreated: Date
	, dateUpdated: Date
	, password: String
	, salt: String
	, emailVerificationCode: String
	, emailVerified: Boolean
	, mobileVerificationCode: String
	, mobileVerified: Boolean
	, gender: String
	, resetPasswordToken: String
	, resetPasswordExpires: Date
	, userLoginType: String
	, isSocialLogin: Boolean
	, score: { type: Number, default: 0 }
	, promoCode: {
		text: String
		, appliedOn: Number
	}
},
	{
		timestamps: true
		, collection: 'user'
	}
);