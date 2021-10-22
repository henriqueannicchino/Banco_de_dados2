const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
	//isAuthenticated vem do password
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error_msg', 'Not Authorized');
	res.redirect('/users/login');
}

module.exports = helpers;