var config      = require('../config'),
    models 	    = require('../models'),
    auth 	    = require("../util/authorized_controller"),
    IdGenerator = models.IdGenerator,
    Inbox 	    = models.Inbox;

const ITEM_LIMIT    = config.params.item_limit;

module.exports = {

	mapping: {
		"index" : {
			"url":"/inbox/:typeMsg?/:page?",
			"method":"get",
			"description":"post list",
			"auth":true
		},
		"new" : {
			"url":"/inbox/compose",
			"method":"put",
			"description":"create a new post",
			"auth":true
		},
		"create" : {
			"url":"/inbox/send",
			"method":"put",
			"description":"create a new post",
			"auth":true
		},
        "msg_view" : {
			"url":"/inbox/:typeMsg?/view/:id?",
			"method":"get",
			"description":"create a new post",
			"auth":true
		}
	},

	// GET /inbox
	index : function(req, res) {
		var typeMsg = (req.params.typeMsg||'getmsg').toString();
        var id = 0;
		var page = parseInt(req.params.page||1);
		var mpurl = "/inbox/"+typeMsg;
        auth.handle_authorized_request(req, res, function(req, res, user){
            switch(typeMsg){
                case "sysmsg" :
                    var where = {"from.name":"admin"};
                    break;
                case "sendmsg" :
                    var where = {"from.name":user.name};
                    break;
                default :
                    var where = {"to.name":user.name};
                    break;
            }
            console.log(where);
            Inbox.count(where, function(error, count) {
				var totalpage = Math.ceil(count/ITEM_LIMIT);
				if(page>totalpage){
					page = totalpage;
				}else if(page<1){
					page = 1;
				}
                var pageList = {
                            cat	: id,
                            num	: count,
                            perpage	: ITEM_LIMIT,
                            curpage	: page,
                            mpurl	: mpurl
				};
                Inbox.find(where).skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('date', 'descending').execFind(function(error, inboxes){
                    console.log(inboxes);
                    if(!error) {

                        res.render('inbox/index', {
                            title           : 'my msg' ,
                            topMsgSelect    : typeMsg,
                            inboxes         : inboxes,
                            pageList	    : pageList,
                            message         : {
                                error   : req.flash('error'),
                                success : req.flash('success')
                            }
                        });
                    } else {
                        res.render('inbox/index', {
                            title           : 'my msg' ,
                            topMsgSelect    : typeMsg,
                            pageList	    : pageList,
                            message         : {
                                error   : req.flash('error'),
                                success : req.flash('success')
                            }
                        });
                    }
                });
            });
		});
	},
	// put /inbox/compose
	new : function(req, res) {
		var typeMsg = (req.params.typeMsg||'getmsg').toString();
        auth.handle_authorized_request(req, res, function(req, res, user){
			res.render('inbox/send', {
                title           : 'create category',
                topMsgSelect    : typeMsg,
                to              : req.body.to,
                toId            : req.body.toId
            });
		});
	},
	// PUT /posts
	create : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			IdGenerator.findOne({modelname : 'Inbox'},function(err,doc){
				if(doc){
				    doc.currentid += 1;
				}else{
				    doc = new IdGenerator();
				    doc.modelname = 'Inbox';
				}
				var inbox = new Inbox();
				inbox.id 	        = doc.currentid;
                inbox.title           = req.body.inboxtitle;
                inbox.msg           = req.body.inboxcontent;
				inbox.from.name     = user.name;
                inbox.from.uid      = user.uid;
                inbox.to.uid        = parseInt(req.body.toId);
                inbox.to.name       = req.body.to.toString();
                console.log(inbox);
				inbox.save(function(err){
					if(!err) {
						doc.save(function(err){
						    if(err) req.flash('error', err);
						});
                        req.flash('success', '发送成功');
					}else{
                        req.flash('error', '发送失败');

					}
                    res.redirect('/inbox'+config.app_ext);
				});
			});
		});
	},
    // GET /post-view-:id
	msg_view: function(req, res) {
        var typeMsg = (req.params.typeMsg||'getmsg').toString();
		var id = parseInt(req.params.id);
        auth.handle_authorized_request(req, res, function(req, res, user){
            Inbox.findOne({id : id},function(error, inbox){
                if(!error) {
                    res.render('inbox/view', {
                        title           : 'view post',
                        inbox           : inbox,
                        topMsgSelect    : typeMsg
                    });
                } else {
                    res.send("fail", 500);
                }
            });
       });
	}
}