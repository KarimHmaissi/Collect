var Url = require("url");
var WebCrawler = require("webCrawler");

module.exports = {


	get: function (req, res) {
		// if(typeof req.params.all().id === "string")	{
		// 	var id = req.params.all().id;

		// 	var handler = function (err, link) {
		// 		if(err) {
		// 			res.badRequest("Could not find a link: " + err);
		// 		} else {
		// 			req.json(link);
		// 		}
		// 	}

		// 	LinkUrl.find({where: {id: id}}).exec(handler);

		// } else {
		// 	res.badRequest("Could not find a link with id: " + id);
		// }

		res.json(JSON.stringify({something: "something"}));
	},

	//crawl link and send results in response
	submit: function (req, res) {

		//validate input
		if(typeof req.params.all().url === "string") {
			var url = req.params.all().url;

			

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
					WebCrawler.crawl(url, req.user.id).then(function (linkDetails) {

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
		

	}

}