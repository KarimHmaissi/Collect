var Url = require("url");
var BodyParser = require("body-parser");

module.exports = {

	get: function (req, res) {

		sails.log("hit /links/get")

		if(typeof req.params.all().id === "string")	{
			var id = req.params.all().id;

			var handler = function (err, link) {
				if(err) {
					res.badRequest("Could not find a link: " + err);
				} else {
					res.json(link);
				}
			}

			LinkUrl.find({where: {id: id}}).exec(handler);

		} else {
			res.badRequest("Could not find a link with id: " + id);
		}

	},

	//crawl link and send results in response
	submit: function (req, res) {

		sails.log("hit /login/submit");
		sails.log("having a look at the link you submitted");

		//validate input
		if(typeof req.body.url === "string") {
			var url = req.body.url;

			var handler = function (err, links) {
				if(!err && links.length > 0) {
					var result = {
						details: links[0],
						url: url,
						apiCall: "cache"
					}
					res.json(result);
				} else {
					//if not crawl link and add details to cache and DB
					WebCrawler.crawl(url, req.session.user.id).then(function (linkDetails) {

						//return response
						if(linkDetails.err) {
							res.badRequest("Problem crawling link: " + linkDetails.err);
						} else {
							res.json(linkDetails);
						}
						
					});
				}
			};

			//check if link has already been crawled from cache
			//TEMP
			LinkUrl.find().where({url: url}).exec(handler);


		} else {
			res.badRequest("Not a valid url");
		}
		

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

}