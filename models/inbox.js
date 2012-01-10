var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId    = Schema.ObjectId;

var Inbox = new Schema({
	id		: {type : Number, unique: true},
	title 		: {type : String, required : true},
	msg 		: {type : String, required : true},
    from 		: {
	    uid	: {type : Number, index: true},
        name    : {type : String, required : true, index : true},
        statusf : {type : Boolean, default : false},
        statust : {type : Boolean, default : false}
    },
    to 		    : {
	    uid	: {type : Number, index: true},
        name    : {type : String, required : true, index : true},
        statusf : {type : Boolean, default : false},
        statust : {type : Boolean, default : false}
    },
    date	: {type : Date, default : Date.now},
    status      : {type : Boolean, default : false}
})
exports.Inbox = Inbox;