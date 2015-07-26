var _ = require("lodash");
var Promise = require("bluebird");


// This controller is used for unmoddederated links in a collection

module.exports = {


	get: function (req, res) {
		
		if(typeof req.params.all().id === "string") {

			var id = req.params.all().id;

			Collection.findOne().where({id: id}).populate("groups")
			.then(function (err, collection) {

				if(err) {
					res.json(err);
				} else {


					LinkMeta.find({memberOf: _.pluck(collection.groups, "id")})
					.where({moderated: false})
					.populate("linkUrl")
					.then(function (linkMetas) {
				
						CollectionUtility.addLinksToGroups(linkMetas, collection.groups);

						
						sails.log("finishedCollection");

						sails.log(collection);
						collection.toJSON = undefined;//this will stop waterline's `toJSON` from being called
						sails.log("after toJson override++++++++");
						sails.log(collection);
						res.json(collection);
						



					});

					// CollectionUtility.addLinksToGroups()

				}

			});
		}		


	}

}