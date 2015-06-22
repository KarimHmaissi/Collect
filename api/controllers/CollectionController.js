/**
 * CollectionController
 *
 * @description :: Server-side logic for managing Collections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require("lodash");
var Promise = require("bluebird");

module.exports = {
	
	index: function (req, res) {

		var handler = function (err, collections) {
			if(!err) {
				res.json(collections);
			} else {
				res.json({err: err});
			}
		}

		Collection.find().exec(handler);

		res.json({route: "index"});
	},

	get: function (req, res) {

		sails.log("collections/get");

		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;
			sails.log("id: " + id);

			// var handler = function (err, collection) {
			// 	if(!err && collection) {
			// 		res.json(collection);
			// 	} else {
			// 		res.badRequest("Could not find a collection: " + err);
			// 	}		
			// };

			// Collection.findOne().where({id: id}).populate("links").exec(handler);

			// http://stackoverflow.com/questions/23446484/sails-js-populate-nested-associations
			Collection
			.findOne()
			.where({id: id})
			.populate("links")
			.then(function (collection) {
				var linkUrls = LinkUrl.find({
					id: _.pluck(collection.links, "linkUrl")
				}).then(function (linkUrls) {
					return linkUrls;
				});

				return [collection, linkUrls];
			})
			.spread(function (collection, linkUrls) {
				var linkUrls = _.indexBy(linkUrls, "id");

				collection.links = _.map(collection.links, function (link) {
					link.linkUrl = linkUrls[link.linkUrl];
					return link;
				});

				res.json(collection);
			});
		} else {
			res.json({"error": "invalid id"});
		}	
	},


	submit: function (req, res) {
		sails.log("hit /collections/submit");

		sails.log(req.body);

		//add validation of incoming json here
		var collect = req.body;

		if(!collect.title || !collect.req.session.user || collect.links.length < 1) {
			res.json({err: "Error creating collection"});
		}

		var newCollection = {
			title: collect.title,
			description: collect.description,
			postedBy: req.session.user.id
		};

		var handler = function (err, collection) {
			if(!err && collection) {
				collection.links.add(collect.links);
				collection.save(function (err, collection) {
					res.json(collection);
				});
			} else {
				res.json({err: "Error creating collection: " + err});
			}	
		};

		Collection.create(newCollection).exec(handler);

		// res.json({route: "submit", resJson: req.body});	
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





// {
//     "title": "Title of collection",
//     "description": "Description of collection",
    
//     "links": [
//       {
//         "title": "title of link added by user",
//         "description": "description added by user",
//         "group": "misc",
//         "linkUrl": 1
//       }
//     ]
 
// }