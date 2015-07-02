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

			// var handler = function (err, collection) {
			// 	if(!err && collection) {
			// 		res.json(collection);
			// 	} else {
			// 		res.badRequest("Could not find a collection: " + err);
			// 	}		
			// };

			// Collection.findOne().where({id: id}).populate("links").exec(handler);




			// Collection.findOne().where({id: id}).populate("groups")
			// .then(function (collection) {

			// 	sails.log("init collection");
			// 	sails.log(collection);

			// 	var unflat = _.pluck(collection.groups, "links");
			// 	var flat = _.flatten(unflat, false);

			// 	sails.log("groups");
			// 	sails.log(flat);
				
			// 	var linkMetas = LinkMeta.find({
			// 		id: flat
			// 	}).populate("linkUrl").then(function (linkMetas) {
			// 		sails.log("linkMeta");
			// 		sails.log(linkMetas);
			// 		return linkMetas;
			// 	});

			// 	return [collection, linkMetas];

			// })
			// .spread(function (collection, linkMetas) {
			// 	var linkMetas = _.indexBy(linkMetas, "id");

			// 	collection.groups = _.map(collection.groups, function (group) {
			// 		group.links = _.map(group.links, function (link) {
			// 			link = linkMetas[link];

			// 			return link;
			// 		});	

			// 		return group;
			// 	});

			// 	res.json(collection);
			// });

			Collection.findOne().where({id: id}).populate("groups")
			.then(function (collection) {
				sails.log(collection);
				
				LinkMeta.find({memberOf: _.pluck(collection.groups, "id")}).populate("linkUrl").then(function (linkMetas) {
					sails.log(linkMetas);

					var i,j,
						groupLength = collection.groups.length,
						linkmetasLength = linkMetas.length;

					for(i =0; i < linkmetasLength; i ++) {

						sails.log(i);

						for(j = 0; j < groupLength; j++) {
							if(i === 0) {
								collection.groups[j].links = [];
								sails.log("new links array");
								sails.log(collection.groups[j].links);
								sails.log(collection.groups[j]);
							}	

							if(collection.groups[j].id === linkMetas[i].memberOf) {
								sails.log("adding linkMeta to collection.group");
								
								collection.groups[j].links.push(linkMetas[i]);
								sails.log("new links added");
								sails.log(collection.groups[j].links);
								sails.log(collection.groups[j]);
							}

						}

					}
					sails.log("finishedCollection");
					sails.log(collection);
					sails.log(collection.group[0].links);

					res.json(collection);
				});

				
			});


			// http://stackoverflow.com/questions/23446484/sails-js-populate-nested-associations
			// Collection
			// .findOne()
			// .where({id: id})
			// .populate("links")
			// .then(function (collection) {
			// 	var linkUrls = LinkUrl.find({
			// 		id: _.pluck(collection.links, "linkUrl")
			// 	}).then(function (linkUrls) {
			// 		return linkUrls;
			// 	});

			// 	return [collection, linkUrls];
			// })
			// .spread(function (collection, linkUrls) {
			// 	var linkUrls = _.indexBy(linkUrls, "id");

			// 	collection.links = _.map(collection.links, function (link) {
			// 		link.linkUrl = linkUrls[link.linkUrl];
			// 		return link;
			// 	});

			// 	res.json(collection);
			// });



		} else {
			res.json({"error": "invalid id"});
		}	
	},


	submit: function (req, res) {
		sails.log("hit /collections/submit");

		sails.log(req.body);

		// res.json({stubbed: "stubbed"});

		// add validation of incoming json here
		var collect = req.body;

		if(!collect.title || !req.session.user) {
			res.json({err: "Error creating collection"});
		}

		var newCollection = {
			title: collect.title,
			description: collect.description,
			postedBy: req.session.user.id
		};




		// var handler = function (err, collection) {
		// 	if(!err && collection) {
		// 		collection.links.add(collect.links);
		// 		collection.save(function (err, collection) {
		// 			res.json(collection);
		// 		});
		// 	} else {
		// 		res.json({err: "Error creating collection: " + err});
		// 	}	
		// };

		// Collection.create(newCollection).exec(handler);





		

		


		var handler = function (err, savedCollection) {
			if(!err && savedCollection) {
				sails.log("saved collection ++++++++++++++");
				sails.log(savedCollection);
				sails.log("saved collection ++++++++++++++");


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
			// var savedGroups = [];


			sails.log("loooping over groups");


			return Promise.map(collect.groups, function (group) {

				sails.log("looking at single group");

				return new Promise(function (resolve) {
					

					Group.create(group).exec(function (err, savedGroup) {
						sails.log("saved group ++++++++++++");
						sails.log(savedGroup);
						sails.log("saved group ++++++++++++");
						savedGroup.links.add(group.links);
						savedGroup.save(function (err, moreRecentSavedGroup) {
							sails.log("saved group after adding links ++++++++++++");
							sails.log(moreRecentSavedGroup);
							sails.log("saved group after adding links ++++++++++++");
							resolve(moreRecentSavedGroup);
						});
					});

				});
			});

			
		};

		Collection.create(newCollection).exec(handler);




		//test
		// var newCollection = {
		// 	title: collect.title,
		// 	description: collect.description,
		// 	postedBy: req.session.user.id,

		// 	groups: [
		// 		{
		// 			name: groupName,
		// 			order: 1,
		// 			links: [
		// 				{
		// 					title: "",
		// 					description: "",
		// 					linkUrl: "1"
		// 				}
		// 			]
		// 		}
		// 	]
		// };


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