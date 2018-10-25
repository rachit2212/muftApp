
module.exports = (mocks, callback) => {
	mocks = mocks || {};

	const express = mocks.express || require('express')
		, bodyParser = require('body-parser')
		, mongoose = require('mongoose')
		, path = require('path')
		, config = require('./configs/config')
		, cors = require('cors')
		, app = express()
		, httpStatusCodes = require('./utils/HttpStatusCodes')
		, respond = require('./utils/respond')
		, logger = require('./utils/logger')
		;

	// instantiate models and mongo connection
	const models = mocks.models || require('./api/models');
	const dbUri = config.MONGO.URI;
	const dbOptions = {
		useNewUrlParser: true,
	}

	if (mongoose.connection.readyState !== 1) {
		mongoose.connect(dbUri, dbOptions);
	}

	const cfg = {
		config: config
		, models: models
	};

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(cors());
	app.use(express.static(path.join(__dirname, 'public')));

	// setup routing handlers
	const routes = require('./routes/index')(cfg);
	const authController = require('./api/controllers/AuthController')(cfg);
	app.use('/auth', require('./routes/authRoutes')(cfg));
	app.use('/', authController.authenticate);
	app.use('/', routes);

	// catch 404 and forward to error handler
	app.use((req, res, next) => {
		var errorObj = {
			statusCode: httpStatusCodes.NOT_FOUND
			, error_message: 'REQUESTED RESOURCE DOES NOT EXIST'
		}
		next(errorObj);
	});

	app.use((err, req, res, next) => {
		if (typeof err === 'string') {
			err = {
				statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR
				, error_message: err
			}
		}
		if (err.statusCode === httpStatusCodes.NOT_FOUND) {
			return respond.send404(req, res);
		}
		if (typeof err === 'object' && !err.error_message) {
			err.error_message = 'some error occurred';
		}
		respond.send500(req, res, err);
	})

	callback(app);
};
