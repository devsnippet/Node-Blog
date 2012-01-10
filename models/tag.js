var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Tag 		= mongoose.model("Tag");


var Tag = new Schema({
	id		: {type : Number, unique: true},
	tag		: {type : String, unique: true},
	count		: {type : Number, index: true},
	post_count	: Number,
	create_at	: {type : Date, default : Date.now},
	type		: String,
	tag_sign	:{
		day		: String,
		day_count	: Number,
		week		: String,
		week_count	: Number,
		month		: String,
		month_count	: Number
	
	}
});

exports.Tag = Tag;