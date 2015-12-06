// create Mongoose model
// this is user profile schema

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var touristrequestSchema = new Schema({
	username: String,
	phonenumber: Number,
	email: String,
	date: Date,
	hasCar: Boolean,
	city: String,
	//latitude: Number,
	//longitude: Number,
	submitdate: Date,
	expired:Boolean,
	matched:Boolean
	// please add more datatype
	// schema type see http://mongoosejs.com/docs/guide.html
}, {collection:'tourist'});

module.exports = Mongoose.model('touristrequest', touristrequestSchema); 
