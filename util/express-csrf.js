var crypto = require('crypto');

exports.token = function(req, res) {
	if (typeof req.session.csrf === "undefined" || req.session.csrf === null) {
		req.session.csrf = crypto.createHash('md5').update('' + new Date().getTime() + req.session.lastAccess).digest('hex');
	}
	return req.session.csrf;
};

exports.check = function() {
	return function(req, res, next) {
    	// If request is ajax, no need to check csrf.
		if (req.xhr === false && req.body && (req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put')) {
			var csrf = req.session.csrf;
			req.session.csrf = null;
			if (req.body.csrf !== csrf) {
				return res.send("Cross-site request forgery attempt discovered!", 403);
			}
		}
		return next();
	};
};