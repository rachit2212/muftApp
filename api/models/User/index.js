const mongoose = require('mongoose')
    , crypto = require('crypto')
    , userSchema = require('./userSchema')
    ;

var policyPasswordStrength = [
	// require at least 8 characters
	, function(password) {
		if (password.length < 5) {
			return 'Password must be at least 5 characters long.';
		}
	}
	// require at least one number
	, function(password) {
		if (!/[0-9]/.test(password)) {
			return 'Password must contain at least one number.';
		}
	}
];

function hashPassword(password, salt) {
	var hash = crypto.createHash('sha256');
	hash.update(password);
	hash.update(salt);
	return hash.digest('hex');
}

function testPassword(password) {
	var errors = [];
	policyPasswordStrength.forEach(function(testPasswordStrength) {
		var validation = testPasswordStrength(password);
		if (typeof validation === 'string') {
			errors.push(validation);
		}
	});

	return errors;
}

userSchema.pre('validate', function(next) {
	var user = this;

	if (user.isModified('password')) {
		var errors = testPassword(user.password);
		if (errors.length) {
			this.invalidate('password', errors.join(' '));
		}
	}

	next();
});

userSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	var salt = crypto.randomBytes(128).toString('base64')
		, hash = hashPassword(user.password, salt);

	user.password = hash;
	user.salt = salt;

	next();
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	var hash = hashPassword(candidatePassword, this.salt);
	return hash == this.password;
};

userSchema.virtual('name.full').get(function() {
	return this.name.first + ' ' + this.name.last;
});

var User = mongoose.model('User', userSchema);

module.exports = User;
