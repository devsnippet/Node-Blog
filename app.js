var http			= require("http");
var fs				= require("fs");
var express			= require("express");
var controller		= require("./util/controller");
var csrf 			= require('./util/express-csrf');
var config 			= require('./config');


var app = module.exports = express.createServer();

//配置
app.configure(function(){
	//终端显示运行日志， 如：GET /users/my/friends 200
	app.use(express.logger({ format: ':method :url :status' }));
	app.set('views', __dirname + '/views');//配置模板文件路径
	app.set('view engine', 'html');//配置ejs作为程序的模板引擎
	app.set('view options', {layout: __dirname + '/views/public/layout'});
	app.register(".html", require('ejs'));
	app.use(express.bodyParser()); //Parses body of POST requests
	app.use(express.methodOverride());
	
	app.use(express.cookieParser());
	app.use(express.session({ secret: config.session_secret_key }));

	app.use(csrf.check());
	app.use(app.router);
    app.use(express.static(__dirname + '/public'));
	
});

app.dynamicHelpers({
    session: function(req, res) {
        return req.session;
    },
    csrf: csrf.token
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});
// Register Helper
app.helpers(require('./helpers').Helpers);
app.helpers({
	config: config,
	PageList: function (cat, num, perpage, curpage,mpurl) {
		if(cat==0){
			var cat = "/";
		}else{
			var cat = '/'+cat+'/';
		}
		var multipage = '';
		if(num > perpage) {
			var page = 3;
			var offset = 2;

			var pages = Math.ceil(num / perpage);

			if(page > pages) {
				var from = 1;
				var to = pages;
			} else {
				var from = (curpage - offset);
				var to = (from+page-1);
				if(from < 1) {
					to = (curpage + 1 - from);
					from = 1;
					if((to - from) < page) {
						to = page;
					}
				} else if(to > pages) {
					from = (pages - page + 1);
					to = pages;
				}
			}
			multipage += ((curpage - offset) > 1 && pages > page ? '<a href="'+mpurl+cat+'1'+config.app_ext+'" class="first">1 ...</a>' : '');
            if(curpage > 1){

                multipage += (curpage > 1 && '<a href="'+mpurl+cat+(curpage - 1)+config.app_ext+'" class="prev">&lsaquo;&lsaquo;</a>');
            }else{
                multipage += "";
            }
			for(var i = from; i <= to; i++) {
				multipage += i == curpage ? '<strong style="color:#09C">'+i+'</strong>' :
				'<a href="'+mpurl+cat+i+config.app_ext+'">'+i+'</a>';
			}

            if((curpage + 1)<=pages)
			multipage += ((curpage + 1)<=pages && '<a href="'+mpurl+cat+(curpage + 1)+config.app_ext+'" class="next">&rsaquo;&rsaquo;</a>')+
			(to < pages ? '<a href="'+mpurl+cat+pages+config.app_ext+'" class="last">...</a>' : '');

			multipage = multipage ? '<div class="pages">'+('<em>共&nbsp;'+pages+'页'+num+'&nbsp;条</em>')+multipage+'</div>' : '';
		}
		return multipage;

	}
});

app.get('/', function(req, res){
    res.redirect('/index'+config.app_ext);
});
//启动权限验证等init
controller.bootControllers(app);
//启动监听
app.listen(config.app_port);
//打印
console.log("lunar version " + config.app_version + " now running on port " + config.app_port);
