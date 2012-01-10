var models 	        = require('../models'),
    auth 	        = require("../util/authorized_controller"),
    config 	        = require('../config'),
    BlogPost 	        = models.BlogPost,
    IdGenerator     = models.IdGenerator,
    Category 	= models.Category,
    BlogComment 	= models.BlogComment;
const ITEM_LIMIT    = config.params.item_limit;

module.exports = {

	mapping: {
		"index" : {
			"url":"/blog/:page?",
			"method":"get",
			"description":"post list",
			"auth":false
		},
		"new" : {
			"url":"/blog/admin/write",
			"method":"get",
			"description":"create a new post",
			"auth":true
		},
		"create" : {
			"url":"/blog/save",
			"method":"put",
			"description":"create a new post",
			"auth":true
		},

		"blog_page_list" : {
			"url":"/blog/cat/:id?/:page?",
			"method":"get",
			"description":"create a new post",
			"auth":false
		},
		"blog_view" : {
			"url":"/blog/view/:cid/:id",
			"method":"get",
			"description":"create a new post",
			"auth":false
		}
	},

	// GET /posts-index/:page?

	index: function(req, res) {
		var id = 0;
		var page = parseInt(req.params.page||1)
		var mpurl = "/blog";

		Category.find({type : 1}, function(error, categories){
			BlogPost.count({}, function(error, count) {
				var totalpage = Math.ceil(count/ITEM_LIMIT);
				if(page>totalpage){
					page = totalpage;
				}else if(page<1){
					page = 1;
				}
				BlogPost.find({}).populate('_user').populate('_category').skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('date', 'descending').execFind(function(error, blogPosts) {
					//console.log(blogPosts);
                    if(!error) {
						var pageList = {
                            cat	: id,
                            num	: count,
                            perpage	: ITEM_LIMIT,
                            curpage	: page,
                            mpurl	: mpurl
						}

						//console.log(pageList);
						res.render('blog/list', {
                            title		: 'posts list',
                            posts		: blogPosts,
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
		auth.handle_admin_request(req, res, function(req, res, user){
			Category.find({type : 1}, function(error, category){
				if(!error) {
					res.render('blog/write', {
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
		auth.handle_admin_request(req, res, function(req, res, user){
			IdGenerator.findOne({modelname : 'BlogPost'},function(err,doc){
				if(doc){
				    doc.currentid += 1;
				}else{
				    doc = new IdGenerator();
				    doc.modelname = 'BlogPost';
				}
				var categoryStr = [];
				categoryStr = req.body.post["category"].split("-");
				var blogPost = new BlogPost();
				blogPost.id 	    = doc.currentid;
				blogPost.cat_id     = categoryStr[1];
				blogPost._user 	    = user._id;
				blogPost._category  = categoryStr[0];
				blogPost.title 	    = req.body.post["title"];
				blogPost.link 	    = req.body.post["url"];
				blogPost.content 	    = req.body.post["content"];
				blogPost.tags 	    = req.body.post["tags"];
				blogPost.save(function(err){

					if(!err) {
						doc.save(function(err){
						    if(err) req.flash('error', '更新文章成功，但ID更新失败');
						});
						req.flash('success', '发布文章成功');
					}else{
						req.flash('error', err);
					}
				    res.redirect('/blog/admin/write'+config.app_ext);
				});
			});
		});
	},

	// GET /posts/:id?/:page?
	blog_page_list: function(req, res) {
		var id = parseInt(req.params.id||1);
		var page = parseInt(req.params.page||1);
		var mpurl = "/blog/cat";

		Category.find({type : 1}, function(error, categories){
			BlogPost.count({cat_id : id}, function(error, count) {
				var totalpage = Math.ceil(count/ITEM_LIMIT);
				if(page>totalpage){
					page = totalpage;
				}else if(page<1){
					page = 1;
				}
				BlogPost.find({cat_id : id}).populate('_user').populate('_category').skip((page-1)*ITEM_LIMIT).limit(ITEM_LIMIT).sort('date', 'descending').execFind(function(error, blogPosts) {
					//console.log(blogPosts);
					if(!error) {
						var pageList = {
							cat	    : id,
							num	    : count,
							perpage	: ITEM_LIMIT,
							curpage	: page,
							mpurl	: mpurl
						}
						res.render('blog/list', {
							title       : 'posts list',
							posts       : blogPosts,
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
    // GET /post-view-:id
	blog_view: function(req, res) {
		var cid = parseInt(req.params.cid);
		var id = parseInt(req.params.id);
		Category.find({type : 1}, function(error, categories){
			BlogPost.findOne({id : id}).populate('_user').populate('_category').run(function(error, blogPost){
				BlogComment.find({post_id : id}).populate('_user').sort('date', 'descending').run(function(error, blogComments){
					//console.log(blogPost);
					if(!error) {
					    res.render('blog/view', {
						layout      : false,
						title       : 'view post',
						post        : blogPost,
						blogComments: blogComments,
						categories  : categories,
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
	}
	/* // PUT /blog/comment/create
	comment_create: function(req, res) {
		var id = parseInt(req.body.reply["id"]);
		console.log(id);
		auth.handle_authorized_request(req, res, function(req, res, user){
			BlogPost.findOne({id : id}, function(err, blogpost){
				if(blogpost) {
					console.log(user);
					console.log(req.body);
					
					var comment = new Comment();
					comment.set("parent_id", parseInt(req.body.reply["parentId"]));
					comment.set("content", req.body.reply["content"]);
					comment.set("_user", user._id);
					console.log(comment);
					blogpost.comments.push(comment);
					
					blogpost.save(function(err){
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
		
	} */
}
