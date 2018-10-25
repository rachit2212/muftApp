
let models;

const fetchProducts = (cb) => {
	models.products.find({}).lean().exec(cb);
}

const addProduct = (options, cb) => {
	const product = new models.products(options);
	product.save(cb);
}

const deleteProduct = (productId, cb) => {
	models.products.remove({ _id: productId }).exec(cb);
}

const setRestockValue = (payload, cb) => {
	if (payload.productId) {
		models.products.findOne({ _id: payload.productId }).exec((err, product) => {
			if (err) {
				return cb(err);
			}
			product.restockValue = payload.restockValue;
			product.save(cb);
		})
	} else {
		const updates = {
			$set: {
				restockValue: payload.restockValue
			}
		}
		models.products.updateMany({}, updates, err => {
			cb(err);
		})
	}
}

const productService = {
	fetchProducts
	, addProduct
	, deleteProduct
	, setRestockValue
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

	return productService;
};