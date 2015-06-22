/**
 * CollectionController
 *
 * @description :: Server-side logic for managing Collections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function (req, res) {

		res.json({route: "index"});
	},

	get: function (req, res) {

		sails.log("collections/get");

		if(typeof req.params.all().id === "string") {
			var id = req.params.all().id;

			var handler = function (err, collection) {
				if(!err && collection.length > 0) {
					res.json(collection);
				} else {
					res.badRequest("Could not find a collection: " + err);
				}		
			};

			Collection.findOne().where({id: id}).populate("links").exec(handler);
		}	
	},

	submit: function (req, res) {
		sails.log("hit /collections/submit");

		sails.log(req.body);


		//add validation of incoming json here
		var collect = req.body;

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