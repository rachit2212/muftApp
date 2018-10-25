const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	questionText: String
	, pageTitle: String
	, socialPageUrl: String
	, isImageQuestion: { type: Boolean, default: false }
	, options: { type: [String] }
	, correctOption: { type: Number }
	, category: { type: String, required: true }
	, timeRange: {
		start: Number
		, end: Number
	}
},
{
	timestamps: true
	, collection: 'question'
});