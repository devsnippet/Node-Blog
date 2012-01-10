var mongoose		= require("mongoose");

var Schema		= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var IdGeneratorSchema = new Schema({
    modelname  : { type: String },
    currentid  : { type: Number, default: 1 }
});

exports.IdGenerator = IdGeneratorSchema;
