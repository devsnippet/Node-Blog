var fs              = require("fs");
var config 			= require('../config');
var mappingString   = "";

function add_to_mapping_string(method, url, description, auth) {
	mappingString += "<div style='width: 400px; height: 20px; padding: 5px; background-color: #ccc; color: #000; font-family: Arial, Verdana, sans-serif'><b>" + method + " " + url + "</b></div><div style='width: 400px; padding: 5px; background-color: #eee; color: #000; font-family: Arial, Verdana, sans-serif'>" + description + "<br /><b>Auth:</b> " + auth + "</div><br />";
}

function bootController(app, file) {
  var name = file.replace('.js', '');
  var actions = require('../controllers/' + name);
  var staticServer = require("./StaticServer.js");
  var mapping = actions["mapping"];
	
  Object.keys(actions).map(function(action){
	  var fn = actions[action];
	  
	  if(typeof(fn) === "function") {
		  if(a = mapping[action]) {
            var url_rewrite = a.url+config.app_ext;
		  	add_to_mapping_string(a.method, url_rewrite, a.description, a.auth);

		  	switch(a.method) {
		  		case 'get':
							staticServer.handle(url_rewrite);
							app.get(url_rewrite, fn);
		  					console.log("initialized get " + url_rewrite);
		  					break;
		  		case 'post':
		  					app.post(a.url, fn);
		  					console.log("initialized post " + a.url);
		  					break;
		  		case 'put':
		  					app.put(a.url, fn);
		  					console.log("initialized put " + a.url);
		  					break;
		  		case 'delete':
		  					app.del(a.url, fn);
		  					console.log("initialized delete " + a.url);
		  					break;
		  	}
		  } else {
		  	console.log("WARNING: no mapping for " + action + " defined");
		  }
	}
 });
}


module.exports = {
	bootControllers : function(app) {
    fs.readdir(__dirname + '/../controllers', function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            console.log("booting controller " + file);
            bootController(app, file);
        });
        app.get("/show_available_interfaces", function(req, res){
        	res.send(mappingString);
        });
    });
	}
}
