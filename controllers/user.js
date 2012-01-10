var config 			= require('../config'),
    models 	= require('../models'),
    IdGenerator = models.IdGenerator,
    User 	= models.User;
var auth 	= require("../util/authorized_controller");
/*
function classify(arg) {
	return Object.prototype.toString.call(arg);
}

String.prototype.capitalize = function(){ 
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};*/

/* function counter(name) {
    var ret = db.counters.findAndModify({query:{_id:name}, update:{$inc : {next:1}}, "new":true, upsert:true});
    // ret == { "_id" : "users", "next" : 1 }
    return ret.next;
} */


module.exports = {
	
	mapping: {
		"index" 					: {
			"url":"/user",
			"method":"get", 
			"description":"retrieve all registered users",
			"auth":true
		},
		"profile" 					: {
			"url":"/user/:id?",
			"method":"get", 
			"description":"retrieve all registered users",
			"auth":true
		},
		"reg" 					: {
			"url":"/signup",
			"method":"get", 
			"description":"user join up",
			"auth":false
		},
        "check_reg" 				: {
			"url":"/user/check/:cType/:name",
			"method":"get",
			"description":"user join up",
			"auth":false
		},
		"create"					: {
			"url":"/user/create",
			"method":"put",
			"description":"create a new user",
			"auth":false
		},
		"get_my_friends" 	: {
			"url":"/user/my/friends",
			"method":"get",
			"description":"get all your friends",
			"auth":true
		},
		"edit"						: {
			"url":"/user/info/edit",
			"method":"get",
			"description":"NEEDS TO BE UPDATED get a single user by id",
			"auth":true
		},
		"update"					: {
			"url":"/user/update",
			"method":"post",
			"description":"NEEDS TO BE UPDATED update a given user",
			"auth":true
		},
		"password_edit"					: {
			"url":"/user/pass/edit",
			"method":"get",
			"description":"NEEDS TO BE UPDATED update a given user",
			"auth":true
		},
		"password_update"					: {
			"url":"/user/pass",
			"method":"post",
			"description":"NEEDS TO BE UPDATED update a given user",
			"auth":true
		},
		"delete"					: {
			"url":"/me", 
			"method":"delete",
			"description":"delete your own user, attention: cant be undone",
			"auth":true
		},
		"login"					: {
			"url":"/signin",
			"method":"get",
			"description":"login yourself in",
			"auth":false
		}, 
		"sign_in"					: {
			"url":"/user/signin",
			"method":"post",
			"description":"sign yourself in",
			"auth":false
		},
		"logout"					: {
			"url":"/logout", 
			"method":"get",
			"description":"logout yourself in",
			"auth":false
		}, 
		"add_friend" 			: {
			"url":"/users/add_friend/:user_id", 
			"method":"post",
			"description":"add a friend by user_id",
			"auth":true
		}, 
		"find_users"		: {
			"url":"/users/find/:param",
			"method":"get",
			"description":"find users whose name or prename start with the given param",
			"auth":true
		}
	},
	
	// GET /users
	index: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : user._id, mail : user.mail, password : user.password}, function(error, user){
				if(!error) {
					res.render('user/index', {
                        title       : 'my info',
                        user        : user,
                        message     : {
                            error   : req.flash('error'),
                            success : req.flash('success')
                        }
                    });
				} else {
					res.send("fail", 500);
				}
			});
		});
	}, 
	
	// GET /users
	profile: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var uid = parseInt(req.params.id);
			User.findOne({uid : uid}, function(error, user){
				if(!error) {
					res.render('user/profile', { title: 'my info', user: user});
				} else {
					res.send("fail", 500);
				}
			});
		});
	}, 
	
	// GET /users/edit
	edit: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({uid : user.uid}, function(error, user){
                if(!error) {
					res.render('user/edit', {
                        title   : 'user edit',
                        user    : user
                    });
				} else {
					res.send("failaa", 500);
				}
			});
		});
	}, 
	
	// POST /users/update
	update: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : req.body.user.id,mail : user.mail}, function(error, user){
				if(error) {
					req.flash('error', '获取数据失败');
				} else {
					user.prename 	= req.body.user.prename;
					user.phone 	    = req.body.user.phone;
					user.birthday 	= req.body.user.birthday;
					user.sex 	    = req.body.user.sex;
					user.province 	= req.body.user.province;
					user.city 	    = req.body.user.city;
					user.save(function(error){
						if(error) {
							req.flash('error', '修改用户信息失败');
						} else {
                            req.flash('success', '修改用户信息成功');
						}
                        res.redirect('/user'+config.app_ext);
					});
				}
			});
		});
	},

	// GET /users/password
	password_edit: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			res.render('user/password', {
                title   : 'user password edit',
                user    : user
            });
		});
	}, 
	
	// POST /users/password
	password_update: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : req.body.user.id,mail : user.mail}, function(error, user){
				if(error) {
					req.flash('error', '修改密码失败');
				} else {
					if(user.password == req.body.user.oldpassword && req.body.user.newpassword == req.body.user.repeatpassword){
						user.password 	= req.body.user.newpassword;
					} else {
						req.flash('error', '旧密码错误');
					}
					user.save(function(error){
						if(error) {
							req.flash('error', '修改密码失败');
						} else {
                            req.flash('success', '修改密码成功');
						}
                        res.redirect('/user'+config.app_ext);
					});
				}
			});
		});
	}, 

	// GET /reg
	reg: function(req, res) {
		res.render('public/reg', {
            layout      : false,
            title       : 'join up',
            message     : {
                error   : req.flash('error'),
                success : req.flash('success')
            }

        });
	},
    check_reg: function(req, res) {
        var cType   = req.params.cType;
        var name    = req.params.name;
        if(cType == "mail") {
            //检查email是否已经存在
            User.findOne({mail:name.toString()},function(err, item){
                if(err){
                    res.send(JSON.stringify({"exit":false}), 500);
                }else{
                    if(item)
                        res.send(JSON.stringify({"exit":false}), 200);
                    else
                        res.send(JSON.stringify({"exit":true}), 200);
                }
            });
        }else if (cType == "name") {
            //检查昵称是否已经存在
            User.findOne({name:name.toString()}, function(err, item){
                if(err){
                    res.send(JSON.stringify({"exit":false}), 500);
                }else{
                    if(item){
                        res.send(JSON.stringify({"exit":false}), 200);
                    }else{
                        res.send(JSON.stringify({"exit":true}), 200);
                    }
                }
            });
        }
    },
	// PUT /users/create
	create: function(req, res) {
		IdGenerator.findOne({modelname : 'User'},function(err,idGenerator){
			if(idGenerator){
			    idGenerator.currentid += 1;
			}else{
			    idGenerator = new IdGenerator();
			    idGenerator.modelname = 'User';
			}
			var user = new User();
			user.uid 	    = idGenerator.currentid;
			user.name 	    = req.body.uname;
			user.password 	= req.body.password;
			user.mail 	    = req.body.email;
			user.prename 	= req.body.name;
			user.phone 	    = req.body.cellphone;
			user.birthday 	= req.body.birthday;
			user.sex 	    = req.body.sex;
			user.province 	= req.body.selectp;
			user.city 	    = req.body.selectc;
			user.save(function(err){
				if(!err) {
					idGenerator.save(function(err){
					    if(err) req.flash('error', err);
                        req.flash('success', '注册成功');
					    res.redirect('/signin'+config.app_ext);
					});

				}else{
					req.flash('error', err);
                    res.redirect('/signup'+config.app_ext);
				}
			});
		});
	}, 
	
	// DELETE /users/:id
	delete: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : user._id, mail : user.mail, password : user.password}, function(error, user){
				if(!error) {
					console.log("deleting user " + user.get("mail") + " now");
				} else {
					res.send("fail", 500);
				}
			});
		});
	}, 
	
	// GET /users/login
	login: function(req, res) {
		res.render('public/login', {
            layout      : false,
            title       : 'Log in',
            message     : {
                error   : req.flash('error'),
                success : req.flash('success')
            }
        });
	}, 
	// POST /users/sign_in
	sign_in: function(req, res) {
		delete req.session.auth;
		if(req.body.uname && req.body.password) {
			User.findOne({name : req.body.uname.toString()}, function(error, user){
				if(!error) {
					if(user.password == req.body.password) {
						req.session.cookie.expires = false;//非持久支持
                        req.session.auth = user;
                        req.flash('success', '登录成功');
                        res.redirect('/user'+config.app_ext);
					}
				}else{
                    req.flash('error', error);
                    res.redirect('/signin'+config.app_ext);
                }
			});
		} else {
			req.flash('error', '密码错误');
            res.redirect('/signin'+config.app_ext);
		}
	}, 
	
	// GET /users/logout
	logout: function(req, res) {
		delete req.session.auth;
        req.flash('success', '退出成功');
		res.redirect('/signin'+config.app_ext);
	}, 

	// POST /users/add_friend/:user_id
	add_friend: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var objectId = req.params.user_id;
			user.friends.push(objectId);
			user.save(function(err){
				if(err) {
					res.send("some error occured", 500);
				} else {
					res.send("ok", 200);
				}
			});
		});
	}, 
	
	// GET /users/my/friends
	get_my_friends: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var friends = user.friends;//user.get("friends");
			//console.log(friends);
			User.find({_id : { $in: friends}}, function(err, friends){
				if(friends) {
					res.send(JSON.stringify(friends), 200);
				} else {
					res.send("you have no friends", 404);
				}
			});
		});
	}, 
	
	// GET /users/find/:param
	find_users: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var reg = new RegExp("^" + req.params.param.capitalize());
			User.find({$or: [{name : reg}, {prename : reg}]}, function(err, users){
				if(users) {
					//console.log(users[0].name);
					res.send(JSON.stringify(users), 200);
				} else {
					res.send("no users found", 404);
				}
			});
		});
	}
	
}
