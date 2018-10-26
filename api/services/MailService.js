let config
	, models
	, mailService
	, smtpTransport
	;

const nodemailer = require("nodemailer")
	, logger = require('./../../utils/logger')
	;

const sendEmail = (payload) => {
	const mailOptions = {
		from: 'Muft <' + payload.fromEmail + '>',
		to: payload.to,
		subject: payload.subject,
		html: `<html><head></head><body>${ getMailBody(payload) }</body></html>`
	};

	smtpTransport
		.sendMail(mailOptions)
		.then(() => {})
		.catch(err => {
			logger.error(err);
		})
}

mailService = {
	sendEmail
}

const getMailBody = (payload = {}) => {
	return (
		`Dear ${ payload.userName },
        <br />
        <br />
        Your password is ${ payload.password }. Kindly reset your password on successful login
        <br />
        <br />
        Regards,
        <br />
        Admin Team
        <br />
        Muftt App`
	)
}

module.exports = function(cfg) {
	if (typeof cfg === 'undefined') {
		throw new Error('No config object passed to router.');
	} else if (typeof cfg.models === 'undefined') {
		throw new Error('No models passed to router.');
	} else if (typeof cfg.config === 'undefined') {
		throw new Error('No config passed to router.');
	}

	config = cfg.config;
	models = cfg.models;
	smtpTransport = nodemailer.createTransport(config.smtpConfig)

	return mailService;
};