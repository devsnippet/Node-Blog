var mongoose		= require("mongoose");

var Schema		    = mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var CategorySchema = new Schema({
	id		    : {type : Number, unique: true},
	name 		: {type : String, required : true, unique: true},
    type 		: {type : Number, default : 0},
    posts 		: [{ type: ObjectId, ref: 'Post' }],
    blogposts 	: [{ type: ObjectId, ref: 'BlogPost' }]
});


exports.Category = CategorySchema;