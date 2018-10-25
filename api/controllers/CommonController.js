const respond = require('./../../utils/respond'),
	CONSTANTS = require('./../../configs/constants'),
	async = require('async');

let productService;

const fetchProducts = (req, res) => {
	productService.fetchProducts((err, products) => {
		if (err) {
			return respond.send500(req, res, err);
		}
		respond.send200(req, res, { data: products });
	})
}

const common = {
	fetchProducts
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
	productService = require('./../services/ProductService')(cfg);
	return common;
};
