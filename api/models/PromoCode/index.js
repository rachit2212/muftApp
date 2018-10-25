const mongoose = require('mongoose');
const promoCodeSchema = require('./promoCodeSchema');

module.exports = mongoose.model('PromoCode', promoCodeSchema);