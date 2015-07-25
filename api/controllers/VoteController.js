var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {


	upvote: function  (req, res) {
		
		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;

			var handler = function  (err, collection) {
				
				var i;
				var found = false;
				var length = collection.upvoters.length;

				for(i = 0; i < length; i++) {
					if(collection.upvoters[i] === req.session.user.id) {
						found = true;
					}
				}

				
				if(found) {

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