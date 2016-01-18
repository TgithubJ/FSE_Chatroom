var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if authenticated, redirect him to the signin page
	return res.redirect('/#signin');
};

//Register the authentication middleware
router.use('/chats', isAuthenticated);

router.route('/chats')

	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.username = req.body.username;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})

	//gets all chats
	.get(function(req, res){
		Post.find(function(err, chats){
			if(err){
				return res.send(500, err);
			}
			return res.send(200, chats);
		});
	});

module.exports = router;