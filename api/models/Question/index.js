const mongoose = require('mongoose');
const questionModelSchema = require('./questionSchema');

module.exports = mongoose.model('QuestionModel', questionModelSchema);