/**
 * CollectionController
 *
 * @description :: Server-side logic for managing Collections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function (req, res) {

		res.json(JSON.stringify({route: "index"}));
	},

	get: function (req, res) {

		sails.log("collection/get");

		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;

			var handler = function (err, collection) {
				if(!err && collection.length > 0) {
					res.json(collection);
				} else {
					res.badRequest("Could not find a collection: " + err);
				}		
			};

			Collection.find({id: id}).exec(handler);
		}	
	},

	submit: function (req, res) {
		res.json({route: "submit"});	
	},


	update: function (req, res) {
		res.json({route: "update"});
	},

	delete: function (req, res) {
		res.json({route: "delete"});
	},

	tag: function (req, res) {
		res.json({route: "tag"});
	}


};

