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
 		
 		var group = req.body.group;
 		var meta = req.body.meta;

 		//verify incoming json
 		if(!CollectionUtility.validGroup(group) || !req.session.user) {
 			res.json({err: "Error adding link"});
 		}


 		//if collection id is valid
 		var collectionTestHandler = function (collections) {
 			if(collections.length > 0) {
 				// collection exists
 				group.memberOf = meta.collectionId;
				addLinkToGroup();
 			} else {
 				// collection does not exist
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
 					groups.save(function (err, finishedGroup) {
 						if(!err) {
	 						res.json(finishedGroup);
 						} else {
 							res.json(err);
 						}
 					});
 				} else {
 					//group does not exist
 					Group.create(group).exec(function (err, savedGroup) {
 						if(!err) {
 							res.json(err);
 						} else {
 							res.json(savedGroup);
 						}
 						

 					});
 				}
 			};
 			
 			Group.find().where({name: group.name, memberOf: group.memberOf}).then(groupTestHandler);	
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