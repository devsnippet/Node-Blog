var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Category 		= mongoose.model("Category");
var User 		= mongoose.model("User");

var Post = new Schema({
	id			: {type : Number, unique: true},
	cat_id			: {type : Number, index: true},
	title			: String,
	uid			: {type : Number, index: true},
	content			: String, 
	link		 	: String,
	comments_count 		: {type : Number, default: 0},
	created_at		: {type : Date, default : Date.now},
    _category		: {type : ObjectId, ref: 'Category'},
	_user			: {type : ObjectId, ref: 'User'}
});


/* Post.statics.pageList = function(where, page, limit, callback){
	return this.find(where).skip(limit * page).limit(limit + 1).sort([['created_at', 'descending']]).all(callback);
} */


/* BlogPost.methods.findCreator = function (callback) {
  return this.db.model('Person').findById(this.creator, callback);
}

BlogPost.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

fetch: function(where, page, limit, callback){
				return this.find(where).skip(limit * page).limit(limit + 1).sort([['created', 'descending']]).all(callback);
			}
			
Post.methods.page = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
} */


exports.Post = Post;
