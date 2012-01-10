var models 	        = require('../models'),
    auth 	        = require("../util/authorized_controller"),
    config 	        = require('../config'),
    Post 	        = models.Post,
    Comment 	    = models.Comment,
    IdGenerator     = models.IdGenerator,
    Category 	    = models.Category;
const ITEM_LIMIT    = config.params.item_limit;

module.exports = {
	
	mapping: {
		"index" : {
			"url":"/posts/:page?",
			"method":"get",
			"description":"post list",
			"auth":false
		},
		"new" : {
			"url":"/post/write",
			"method":"get",
			"description":"create a new post",
			"auth":true
		},
		"create" : {
			"url":"/post/save",
			"method":"put",
			"description":"create a new post",
			"auth":true
		},

		"posts_page_list" : {
			"url":"/posts/cat/:id?/:page?",
			"method":"get",
			"description":"create a new post",
			"auth":false
		},
		"my_posts_list" : {
			"url":"/posts/my/:page?",
			"method":"get",
			"description":"create a new post",
			"auth":true
		},
		"posts_view" : {
			"url":"/post/view/:cid/:id",
			"method":"get",
			"description":"create a new post",
			"auth":false
		},
		
		"ajax_post_comment" : {
			"url":"/post/comment/ajax",
			"method":"post",
			"description":"create a new post",
			"auth":false
		},
		"get_my_posts"	: {
			"url":"/posts/my",
			"method":"get",
			"description":"get posts written by yourself",
			"auth":true
		}, 
		"get_posts_on_my_wall" : {
			"url":"/posts/wall",
			"method":"get",
			"description":"get all the posts on your own wall",
			"auth":true
		}, 
		"get_posts_on_wall" : {
			"url":"/posts/wall/:id",
			"method":"get",
			"description":"get all the posts on the wall of a given user",
			"auth":true
		},
		"add_comment" : {
			"url":"/posts/:id/add_comment",
			"method":"put",
			"description":"add a comment to an existing post",
			"auth":true
		}
	}, 
	
	// GET /posts-index/:page?
	
	index: function(req, res) {
		var id = 0;
		var page = parseInt(req.params.page||1);
		var mpurl = "/posts";
		
		Category.find({type : 0}, function(error, categories){
			Post.count({}, function(error, count) { 
				var totalpage = Math.ceil(count/ITEM_LIMIT);
				if(page>totalpage){
					page = totalpage;
				}else if(page<1){
					page = 1;
				}
				Post.find({}).populate('_user').populate('_category').skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('created_at', 'descending').execFind(function(error, posts) { 
					if(!error) {
						var pageList = {
                            cat	: id,
                            num	: count,
                            perpage	: ITEM_LIMIT,
                            curpage	: page,
                            mpurl	: mpurl
						}

						//console.log(pageList);
						res.render('post/list', { 						
                            title		: 'posts list',
                            posts		: posts,
                            categories	: categories,
                            pageList	: pageList,
                            topSelect	: 'all'
						});
					} else {
                        res.send("fail", 500);
					}
				});
			});
		});
	},
	
	// GET /post/write.ext
	new : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			Category.find({type : 0}, function(error, category){
				if(!error) {
					res.render('post/write', {
                        title       : 'post an article' ,
                        category    : category,
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
	
	
	// PUT /posts
	create: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			IdGenerator.findOne({modelname : 'Post'},function(err,doc){
				if(doc){
				    doc.currentid += 1;
				}else{
				    doc = new IdGenerator();
				    doc.modelname = 'Post';
				}
				var categoryStr = [];
				categoryStr = req.body.post["category"].split("-");
				var post = new Post();
				post.id 	    = doc.currentid;
				post.cat_id 	= categoryStr[1];
				post.uid 	    = user.uid;
				post._user 	    = user._id;
				post.title 	    = req.body.post["title"];
				post.link 	    = req.body.post["url"];
				post.content 	= req.body.post["content"];
				post._category 	= categoryStr[0];
				post.save(function(err){

					if(!err) {
						doc.save(function(err){
						    if(err) req.flash('error', '更新文章成功，但ID更新失败');
						});
                        req.flash('success', '发布文章成功');
					}else{
						req.flash('error', '发布文章失败');
					}
				    res.redirect('/post/write'+config.app_ext);
				});
			});
		});
	}, 
	
	// GET /posts/:id?/:page?
	posts_page_list: function(req, res) {
		var id = parseInt(req.params.id||1);
		var page = parseInt(req.params.page||1);
		var mpurl = "/posts/cat";
		
		Category.find({type : 0}, function(error, categories){
			Post.count({cat_id : id}, function(error, count) { 
				var totalpage = Math.ceil(count/ITEM_LIMIT);
				if(page>totalpage){
					page = totalpage;
				}else if(page<1){
					page = 1;
				}
				Post.find({cat_id : id}).populate('_user').populate('_category').skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('created_at', 'descending').execFind(function(error, posts) { 
					if(!error) {
						var pageList = {
						cat	    : id,
						num	    : count,
						perpage	: ITEM_LIMIT,
						curpage	: page,
						mpurl	: mpurl
								}
								res.render('post/list', { 
						title       : 'posts list',
						posts       : posts,
						categories  : categories,
						pageList    : pageList,
						topSelect   : id
						});
					} else {
						res.send("fail", 500);
					}
				});
			});
		});
	},
	// GET /my-posts
	my_posts_list: function(req, res) {
		var id = 0;
		var page = parseInt(req.params.page||1);
		var mpurl = "/posts/my";
		auth.handle_authorized_request(req, res, function(req, res, user){
			Category.find({type : 0}, function(error, categories){
				Post.count({uid : user.uid}, function(error, count) { 
					var totalpage = Math.ceil(count/ITEM_LIMIT);
					if(page>totalpage){
						page = totalpage;
					}else if(page<1){
						page = 1;
					}
					Post.find({uid : user.uid}).populate('_user').populate('_category').skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('created_at', 'descending').execFind(function(error, posts) {
						if(!error) {
							console.log(posts);
							var pageList = {
                                cat	    : id,
                                num	    : count,
                                perpage	: ITEM_LIMIT,
                                curpage	: page,
                                mpurl	: mpurl
							}

							res.render('post/list', { 
                                title       : 'posts list',
                                posts       : posts,
                                categories  : categories,
                                pageList    : pageList,
                                topSelect   : id
							});
						} else {
							res.send("fail", 500);
						}
					});
				});
			});
		});
	},
	// GET /post-view-:id
	posts_view: function(req, res) {
        var cid = parseInt(req.params.cid);
		var id = parseInt(req.params.id);
		Category.find({type : 0}, function(error, categories){
			Post.findOne({id : id}).populate('_user').populate('_category').run(function(error, post){
				Comment.find({post_id : id}).populate('_user').limit(3).sort('date', 'descending').run(function(error, comments){
						if(!error) {
							res.render('post/view', { 
								layout      : false,
								title       : 'view post',
								post        : post,
								categories  : categories,
								comments    : comments,
								topSelect   : cid,
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
		});
	}, 
	// POST /post/comment/ajax
	ajax_post_comment: function(req, res){
		if(parseInt(req.body.commentId)){
			var id = parseInt(req.body.id);
			var commentId = parseInt(req.body.commentId);
			Comment.find({post_id : id, id: {"$lte": commentId}}).populate('_user').limit(ITEM_LIMIT).sort('date', 'descending').run(function(error, ajax_comments){
				console.log(ajax_comments);
				if(!error) {
					var str = "";	
					if(ajax_comments.length>0) {
						ajax_comments.forEach(function(comment) {
					
							str += "<div class=\"comment\" id=\""+comment.id+"\">";
							str += "<div class=\"author-comment\">";
							str += "<a href=\"/user/"+comment._user.uid+config.app_ext+">"+comment._user.prename+"</a>";
							str += "</div>";
							str += "<div class=\"comment-content\">"+comment.content;
							str += "<div class=\"datetime\">"+comment.date.timeSince()+"&nbsp;&nbsp;&nbsp;&nbsp;<span>refer&nbsp;&nbsp;&nbsp;&nbsp;replay</span></div>";
							str += "</div></div></div>";
						});
						console.log(str);
						res.send(str, 200);
					}
					
				}
				
			});
		}
	},
	// GET /posts
	get_my_posts : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user) {
			Post.find({user : user.get('_id')}).populate('_user').populate('_category').run(function(err, posts){
				if(posts) {
					res.send(JSON.stringify(posts), 200);
				} else {
					res.send("no posts found", 404);
				}
			});
		});
	}, 
	
	// GET /posts/wall
	get_posts_on_my_wall : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			Post.find({$or: [{on_wall : user.get("_id")}, {user : user.get("_id")}]}, function(err, posts){
				if(posts) {
					res.send(JSON.stringify(posts), 200);
				} else {
					res.send("no posts found", 404);
				}
			});
		});
	}, 
	
	// GET /posts/wall/:id
	get_posts_on_wall : function(req, res) {
		Post.find({$or: [{on_wall : req.params.id}, {user : req.params.id}]}, function(err, posts){
			if(posts) {
				res.send(JSON.stringify(posts), 200);
			} else {
				res.send("no posts found", 404);
			}
		});
	}, 
	
	// PUT /posts/:id/add_comment
	add_comment : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			Post.findOne({_id : req.params.id}, function(err, post){
				if(post) {
					var comment = new Comment();
					comment.set("user", req.body.comment["user"]);
					comment.set("content", req.body.comment["content"]);
					
					post.comments.push(comment);
					
					post.save(function(err){
						if(!err) {
							res.send("ok", 200);
						} else {
							res.send(err.message, 500);
						}
					});
				} else {
					res.send("no post with that id found", 404);
				}
			});
		});
	}
}
