var express = require('express');
var records = require('./models/touristrequest');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var profileIndex = require('./routes/profileIndex'); // defined router
var app = express();


// connect to database
// obtain DB details from a config file
mongoose.connect('mongodb://localhost:27017/appDB');
var db = mongoose.connection;

// error handler
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connect to database "appDB"');// yay!
});

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', profileIndex);

module.exports = app;

app.listen(80, function(){
  console.log('Server is listening to port 80...');
})

function UpdateExpiredRequest() {
	records.update({date:{$lte:Date.now()}}, {$set:{expired:true}} , function(err, record) {
                if (err) {
                       	console.log(err);
                }
                console.log('setInterval called');
        });
}

setInterval(UpdateExpiredRequest, 86400000);
//setInterval(UpdateExpiredRequest, 2000);

function AvgData() {
	var day = Date.now() - 86400000;
	records.find({submitdate:{$gte:day}}).count(function(err,recordnum){
		if (err) {
                       	console.log(err);
                }
		console.log('total request number in last 24hours');
                console.log(recordnum);
	});
}

setInterval(AvgData, 86400000);
//setInterval(AvgData, 2000);
