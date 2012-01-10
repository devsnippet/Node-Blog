var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Category 		= mongoose.model("Category");
var User 		= mongoose.model("User");

var BlogPost = new Schema({
	id			: {type : Number, unique: true},
	cat_id			: {type : Number, index: true},
	title			: String,
	uid			: {type : Number, index: true},
	content			: String, 
	link		 	: String,
	tags        		: [String],
	comments_count 		: {type : Number, default: 0},
	date		: {type : Date, default : Date.now},
    _category		: {type : ObjectId, ref: 'Category'},
	_user			: {type : ObjectId, ref: 'User'}
});


exports.BlogPost = BlogPost;