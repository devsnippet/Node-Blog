var url		= require("url");
var config 			= require('../config');
var mongoose	= require("mongoose");
var User 	= mongoose.model("User");

module.exports = {
	handle_authorized_request: function(req, res, fn) {
		var auth = req.session.auth;
		var user_id = null;
		var user_mail = null;
		//console.log(auth);
		if(auth) {
			user_id = auth._id;
			user_mail = auth.mail;
			User.findOne({_id : user_id, mail : user_mail}, function(error, user){
				//console.log(user);
                if(user) {
                    console.log("user " + user.get("mail") + " successfully authenticated");
                    fn(req, res, user);
				} else {
					console.log("failed authorization");
					res.send("somethings wrong with your credentials..." + user_id + " " + user_mail, 403);
				}
			});
		} else {
			/* var realpath = url.parse(req.url).pathname;
			console.log(realpath);
			     if(path.existsSync(realpath)){
				res.end(fs.readFileSync(realpath));
			    }else{
				res.end('Cannot find request url: '+req.url);
			    } */
			res.redirect('/signin'+config.app_ext);
			//res.send("not authorized, please login first", 403);
		}
	},
    handle_admin_request: function(req, res, fn) {
		var auth = req.session.auth;
		var user_name = null;
		//var user_mail = null;
		//console.log(auth);
		if(auth.name == 'admin') {
			user_name = auth.name;
			//user_mail = auth.mail;
			User.findOne({name : user_name}, function(error, user){
				//console.log(user);
                if(user) {
                    console.log("user " + user.get("mail") + " successfully authenticated");
                    fn(req, res, user);
				} else {
					console.log("failed authorization");
					res.send("somethings wrong with your credentials..." + user_id + " " + user_mail, 403);
				}
			});
		} else {
			/* var realpath = url.parse(req.url).pathname;
			console.log(realpath);
			     if(path.existsSync(realpath)){
				res.end(fs.readFileSync(realpath));
			    }else{
				res.end('Cannot find request url: '+req.url);
			    } */
			res.redirect('/');
			//res.send("not authorized, please login first", 403);
		}
	}
}
