/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , db = require('../config').db;

var uri = 'mongodb://';
if(db.user && db.password) {
    uri += db.user + ':' + db.password + '@';
}
db.host = db.host || 'localhost';
uri += db.host;
if(db.port) {
    uri += ':' + db.port;
}
uri += '/' + db.name;

mongoose.connect(uri, function(err) {
    if(err) {
        console.error(uri + ' error: ' + err.message);
        console.error(err);
        process.exit(1);
    } else {
        console.log(uri + ' success.');
    }
});

//加载models
exports.IdGenerator 	= mongoose.model("IdGenerator", require("./idgenerator").IdGenerator);
exports.User 		= mongoose.model("User", require("./user").User);
exports.Category 	= mongoose.model("Category", require("./category").Category);
exports.Comment 	= mongoose.model("Comment", require("./comment").Comment);
exports.Post 		= mongoose.model("Post", require("./post").Post);
exports.Inbox	 	= mongoose.model("Inbox", require("./inbox").Inbox);
exports.BlogPost 	= mongoose.model("BlogPost", require("./blogPost").BlogPost);
exports.BlogComment 	= mongoose.model("BlogComment", require("./blogComment").BlogComment);
exports.Photo 		= mongoose.model("Photo", require("./photo").Photo);


