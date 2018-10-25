const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answeredQuestionSchema = new Schema({
	questionId: String
	, category: { type: String, required: true }
	, username: String
	, date: Number
}, {
	timestamps: true
	, collection: 'answeredQuestion'
});

answeredQuestionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 432000000 })

module.exports = answeredQuestionSchema;