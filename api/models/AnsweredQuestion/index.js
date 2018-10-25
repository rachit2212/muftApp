const mongoose = require('mongoose');
const answeredQuestionSchema = require('./answeredQuestionSchema');

module.exports = mongoose.model('AnsweredQuestionModel', answeredQuestionSchema);