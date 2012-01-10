var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;



var User = new Schema({
	uid		    : {type : Number, required : true, unique: true},
	mail		: {type : String, required : true, unique: true},
	name 		: {type : String, required : true, unique: true},
	prename		: String, 
	password 	: String,
	phone		: String,
	birthday	: String,
	sex		: String, 
	province 	: String,
	city		: String,
	created_at	: {type : Date, default : Date.now},
	friends		: [ObjectId],
	posts 		: [{ type: ObjectId, ref: 'Post' }],
    blogposts 	: [{ type: ObjectId, ref: 'BlogPost' }],
	comments 	: [{ type: ObjectId, ref: 'Comment' }]
});


exports.User = User;
