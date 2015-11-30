// create Mongoose model
// this is user profile schema

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var profileSchema = new Schema({
	username: String,
	password: String,
	record:[Schema.Types.ObjectId] 
	// please add more datatype
	// schema type see http://mongoosejs.com/docs/guide.html
},{collection:'profile'});

module.exports = Mongoose.model('profile', profileSchema); 
