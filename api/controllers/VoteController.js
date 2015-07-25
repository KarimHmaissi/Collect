var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {


	upvote: function  (req, res) {

		sails.log("hit /votes/upvote");
		
		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;

			var handler = function  (err, collection) {
				
				if(err || !collection) {
					res.json(err);
				}



				var i;
				var found = false;
				var length = collection.upvoters.length;

				sails.log(collection.upvoters);

				sails.log(collection.upvoters.length);
				sails.log("user id: ");
				sails.log(req.session.user.id);

				for(i = 0; i < length; i++) {

					sails.log("entered loop");
					sails.log(collection.upvoters[i].id);

					if(collection.upvoters[i].id === parseInt(req.session.user.id), 10) {
						found = true;
					}
				}

				sails.log(found);

				if(!found) {

					//increment upvote count
					collection.upvotes += 1;


					//add user to upvoters 
					collection.upvoters.add(req.session.user);

					//save collection
					collection.save(function (err, savedCollection) {
						if(err) {
							sails.log(err);
							res.json(err);
						} else {
							res.json(savedCollection);
						}

						
					});

					


				} else {
					//already upvoted
					sails.log("already upvoted");
					res.json({err: "user has already upvoted this collection"});
				}

			};

			Collection.findOne().where({id: id}).populate("upvoters").exec(handler);
		}

	}

}