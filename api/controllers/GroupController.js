/**
 * GrooupController
 *
 * @description :: Server-side logic for managing Grooups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var _ = require("lodash");
 var Promise = require("bluebird");


 module.exports = {

 	get: function (req, res) {
 		res.json({route: "get"});
 	},

 	submit: function (req, res) {
 		
 		sails.log("hit groups/submit");
 		sails.log(req.body);
 		sails.log(req.body.group);
 		sails.log(req.body.meta);

 		sails.log(req.session.user);
 		sails.log(CollectionUtility.validateGroup(group));


 		var group = req.body.group;
 		var meta = req.body.meta;

 		//verify incoming json
 		if(!CollectionUtility.validateGroup(group)) {
 			sails.log("error validating group or no session");
 			res.json({err: "Error adding link"});
 		} else {
	 		//if collection id is valid
	 		var collectionTestHandler = function (collections) {
	 			if(collections.length > 0) {
	 				// collection exists
	 				group.memberOf = meta.collectionId;
	 				sails.log("found collection continuing");
					addLinkToGroup();
	 			} else {
	 				// collection does not exist
	 				sails.log("cant find collection invalid id");
	 				res.json({err: "Collection does not exist"});
	 			}
	 		};

	 		Collection.find().where({id: meta.collectionId}).then(collectionTestHandler);


	 		var addLinkToGroup = function () {

	 			var groupTestHandler = function (groups) {
	 				//if group exists in collection
	 				if(groups.length > 0) {
	 					// group exists
	 					groups[0].ownedLinks = groups[0].ownedLinks.concat(group.ownedLinks);
	 					groups[0].save(function (err, finishedGroup) {
	 						if(!err) {
	 							sails.log("saved group");
		 						res.json(finishedGroup);
	 						} else {
	 							sails.log("error saving group");
	 							res.json(err);
	 						}
	 					});
	 				} else {
	 					//group does not exist
	 					Group.create(group).exec(function (err, savedGroup) {
	 						if(!err) {
	 							sails.log("created new group");
	 							res.json(err);
	 						} else {
	 							sails.log("eroor creating new group");
	 							res.json(savedGroup);
	 						}
	 						

	 					});
	 				}
	 			};
	 			
	 			Group.find().where({name: group.name, memberOf: group.memberOf}).then(groupTestHandler);	
 		}


 		
 		};
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