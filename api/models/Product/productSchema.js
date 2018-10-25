const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	buyingPoints: Number,
	imageUrl: String,
	name: String,
	description: String,
	type: String,
	restockValue: Boolean
}, {
	timestamps: true
	, collection: 'products'
});