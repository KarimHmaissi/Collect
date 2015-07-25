var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {


	upvote: function  (req, res) {
		
		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;

			var handler = function  (err, collection) {
				
				if(collection.upvoters.indexof(req.session.user.id) < 0) {

					//increment upvote count
					collection.upvotes += 1;


					//add user to upvoters 
					collection.upvoters.add(req.session.user.id);

					//save collection
					collection.save(function (err, savedCollection) {
						res.json(savedCollection);
					});

					


				} else {
					//already upvoted

					res.json({err: "user has already upvoted this collection"});
				}

			};

			Collection.findOne().where({id: id}).exec(handler);
		}

	}

}