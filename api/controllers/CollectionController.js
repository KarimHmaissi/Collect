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
		sails.log("hit /collection/index");
		var handler = function (err, collections) {
			if(!err) {
				res.json(collections);
			} else {
				res.json({err: err});
			}
		}

		Collection.find().limit(15).sort('createdAt desc').exec(handler);

	},


	


	get: function (req, res) {

		sails.log("collections/get");

		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;
			sails.log("id: " + id);

			Collection.findOne().where({id: id}).populate("groups")
			.then(function (collection) {

				
				LinkMeta.find({memberOf: _.pluck(collection.groups, "id")})
				.where({moderated: true})
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

				
			});


		} else {
			res.json({"error": "invalid id"});
		}	
	},



	submit: function (req, res) {
		sails.log("hit /collections/submit");

		sails.log(req.body);

	

		// add validation of incoming json here
		var collect = req.body;

		if(!CollectionUtility.validateNewCollection(collect)) {
			res.json({err: "Error creating collection"});
		}



		var newCollection = {
			title: collect.title,
			description: collect.description,
			postedBy: req.session.user.id
		};

		var handler = function (err, savedCollection) {
			if(!err && savedCollection) {
				sails.log("saved collection ++++++++++++++");
				sails.log(savedCollection);



				saveGroups(savedCollection).then(function (savedGroups) {
					sails.log("saving entire collection");

					savedCollection.groups.add(savedGroups);

					savedCollection.save(function (err, finishedCollection) {
						sails.log("entire collection saved");

						res.json(finishedCollection);
					});
				});


				
				

			} else {
				res.json({err: "Error creating collection: " + err});
			}	
		};

		//save groups first
		var saveGroups = function (savedCollection) {


			sails.log("loooping over groups");


			return Promise.map(collect.groups, function (group) {

				sails.log("looking at single group");

				return new Promise(function (resolve) {
					

					Group.create(group).exec(function (err, savedGroup) {
						sails.log("saved group ++++++++++++");
						sails.log(savedGroup);

						resolve(savedGroup);
					});

				});
			});

			
		};

		Collection.create(newCollection).exec(handler);

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

