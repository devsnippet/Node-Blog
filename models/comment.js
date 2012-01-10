var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var User 		= mongoose.model("User");


var Comment = new Schema({
	id		: {type : Number, unique: true},
	parent_id	: Number,
	post_id		: {type : Number, index: true},
	_user		: {type : ObjectId, ref: 'User'},
	date		: {type : Date, default : Date.now},
	content		: String
});

exports.Comment = Comment;
