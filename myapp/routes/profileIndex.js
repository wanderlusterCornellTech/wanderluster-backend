// all the routes go in routes/profiles.js
var profiles = require('../models/profile');
//var matches = require('../models/match');
//var tourguides = require('../models/tourguide');
var records = require('../models/touristrequest');
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'liudan.xiao.pku@gmail.com',
        pass: 'Xld@530303'
    }
});

/**
// get all profiles
router.get('/profiles', function(req, res) {
	profiles.find(function(err,profile){  // no premeter only allback function
		if(err){						  // find() return all
			return res.send(err);
		}

		res.json(profile);
	});

});
**/
// add new profile
router.post('/register', function(req, res){
	var newprof = new profiles(req.body);
	
	profiles.find({username: req.body.username}).count(function(err, profilecount){
 		if (err) {
                	return res.send(err);
        	}
		if (profilecount == 0){
			newprof.save(function(err){
			if (err){
				return res.send(err);
                	}
       			return res.send({message: 'Success!'});
			});
		}
		else {
			return res.send({message: 'Username has been used'});
		}
	});

});

router.get('/login', function(req,res){
	profiles.find({username: req.body.username, password: req.body.password}).count(function(err, profilecount){
                if (err) {
  	              return res.send(err);
        	}
		if (profilecount == 1) {
			return res.send({message: 'Login Success!'});
		}
		else {
			return res.send({message: 'Username or Password invalid'});
		}
        });
});

router.post('/request', function(req,res){
	var newrecord = new records(req.body);

        newrecord.save(function(err){
		if (err){
			return res.send(err);
		}
		//res.send({message: 'Success!'});
	});

	profiles.update({username: req.body.username}, {$addToSet:{record:newrecord._id}},function(err, profile) {
		if (err) {
			return res.send(err);
		}
		res.json(profile);
	});
});

router.get('/match', function(req,res){
	records.find({hasCar: req.body.hasCar, city: req.body.city, expired: false, matched: false}, function(err, record) {
		if (err) {
			return res.send(err);
		}
		res.json(record);
	}).limit(10);
});

router.put('/matched', function(req,res){
	var mailOptions = {
    		from: 'Wanderluster', // sender address
    		to: req.body.email, // list of receivers
    		subject: 'Let\'s contact your local tourguide', // Subject line
    		text: 'Let\'s contact your local tourguide', // plaintext body
    		html: '<b>Let\'s contact your local tourguide</b>' // html body
	};

	records.update({_id: req.body._id}, {$set:{matched:true}},  function(err, record) {
		if (err) {
			return res.send(err);
		}

		transporter.sendMail(mailOptions, function(error, info){
    			if(error){
        			return res.send(err);
    			}else{
        			res.send("Message Sent");
    			}
		});
	});

	
});
	
/*// update a profile
router.put('/profiles/:id', function(req, res){
	Profile.findOne({_id: req.params.id}, function(err, profile){
		if (err){
			return res.send(err);
		}


	});
});*/

// retrieving a profile
/*router.get('/profiles/:id', function(req, res){
	Profile.findOne({_id: req.params.id}, function(err, profile){
		if (err) {
      		return res.send(err);
    	}

    	res.json(profile);
	});
});*/

module.exports = router;
