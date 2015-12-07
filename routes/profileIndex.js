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
        user: 'wanderluster.mailer@gmail.com',
        pass: 'wander123'
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
router.post('/register/:username/:password', function(req, res){
	var newprof = new profiles(req.params);
	
	profiles.find({username: req.params.username}).count(function(err, profilecount){
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

router.get('/login/:username/:password', function(req,res){
	profiles.find({username: req.params.username, password: req.params.password}).count(function(err, profilecount){
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

router.post('/request/:username/:phonenumber/:email/:date/:hasCar/:city/:submitdate/:expired/:matched', function(req,res){
	var newrecord = new records(req.params);

        newrecord.save(function(err){
		if (err){
			return res.send(err);
		}
		//res.send({message: 'Success!'});
	});

	profiles.update({username: req.params.username}, {$addToSet:{record:newrecord._id}},function(err, profile) {
		if (err) {
			return res.send(err);
		}
		res.json(profile);
	});
});

router.get('/match/:hascar/:city/', function(req,res){
	if (req.params.hascar == 'true') {
		records.find({city: req.params.city, expired: false, matched: false}, function(err, record) {
			if (err) {
				return res.send(err);
			}
			return res.json(record);
		}).limit(10);
	}
	else {
		records.find({hasCar: false, city: req.params.city, expired: false, matched: false}, function(err, record) {
                        if (err) {
                                return res.send(err);
                        }
                        return res.json(record);
                }).limit(10);
	}
});

router.put('/matched/:id/:email', function(req,res){
	var mailOptions = {
    		from: 'Wanderluster', // sender address
    		to: req.params.email, // list of receivers
    		subject: 'Congratulations! You got matched for your trip.', // Subject line
    		text: 'Your local tourguide will contact with you soon.', // plaintext body
    		html: '<b>Your local tourguide will contact with you soon.</b>' // html body
	};
	
	records.find({_id: req.params.id, matched:false, expired:false}).count(function(err, recordcount){
                if (err) {
                        return res.send(err);
                }
                if (recordcount != 0){
                       	records.update({_id: req.params.id}, {$set:{matched:true}},  function(err, record) {
                		if (err) {
                        		return res.send(err);
                		}

                		transporter.sendMail(mailOptions, function(error, info){
                        		if(error){
                                		return res.send(err);
                        		}else{
                                		return res.send("Message Sent");
                        		}
                		});
        		});
                }
                else {
                        return res.send({message: 'Page Expired, Please Refresh'});
                }
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
