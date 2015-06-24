
var Url = require("url");
var Request = require("request");
var Promise = require("bluebird");
var Bottleneck = require("bottleneck");

var redditLimiter = new Bottleneck(1, 2000);
var embedlyLimiter = new Bottleneck(1, 500);

var embedlyKey = "c4d4b6fe2c034589ba93ba3b1dbffd67";

var urlOptions = {
	hostname: "",
	port: 80,
	path: "/",
	method: "GET"
}


var crawlReddit = function (result) {
	return new Promise(function (fulfill, reject) {

		//assumes a valid reddit url -- TODO VALIDATE
		result.apiCall = result.url + ".json";

		//bottleneck limiter - limits calls to api
		redditLimiter.submit(Request, result.apiCall, function (error, response, body) {
			if(!error && response.statusCode === 200) {

				var bodySection = body[0].data.children[0].data;

				result.details = {
					url: result.url,
					title: bodySection.title,
					description: "",
					thumbnail: bodySection.thumbnail,
					providerUrl: "reddit.com",
					embed: null,
					postedBy: req.user[0].id
				}

				fulfill(result);
			} else {
				result.err = "Did not receive a valid response from Reddit.com";
				fulfill(result);
			}
		});
	});
};

var crawlImgur = function (result) {
	return new Promise(function (fulfill, reject) {
		fulfill({});
	});
};

var crawlEmbedly = function (result) {
	return new Promise(function (fulfill, reject) {

		//assumes a valid embedly url -- TODO VALIDATE

		// http://api.embed.ly/1/extract?key=:key&url=:url&maxwidth=:maxwidth&maxheight=:maxheight&format=:format&callback=:callback

		result.apiCall = "http://api.embed.ly/1/extract?key=" + embedlyKey + "&url=" + result.url;

		embedlyLimiter.submit(Request, result.apiCall, function (error, response, body) {
			
			if(!error && response.statusCode === 200) {

				var parsedBody = JSON.parse(body);


				var linkUrl = {
					url: parsedBody.original_url,
					title: parsedBody.title,
					description: parsedBody.description,
					thumbnail: "",
					providerUrl: parsedBody.provider_url,
					providerName: parsedBody.provider_name,
					providerDisplay: parsedBody.provider_display,
					postedBy: result.userId
				}

			
				//thumbnail
				if(parsedBody.images.length > 0) {
					linkUrl.thumbnail = parsedBody.images[0].url;
				}

				//embedly embed
				if(typeof parsedBody.media.type === "string") {
					linkUrl.embedHtml = parsedBody.media.html;
					linkUrl.embedType = parsedBody.media.type;
					linkUrl.embedPresent = true;
				}

				sails.log("Got a response!");
				sails.log(linkUrl);



				//save to DB
				var handler = function (err, savedLink) {
					if(err) {
						result.err("Error saving link details");
						fulfill(result);
					} else {
						result.details = savedLink;
						fulfill(result);
					}
				};

				LinkUrl.create(linkUrl).exec(handler);


			} else {
				result.err = "Did not receive a valid response from Embedly.com";
				fulfill(result);
			}

		});

		
	});
};


//calls appropiate handler depending on domain
var crawlOptions = function (domain, url, userId) {
	// if(domain.indexOf("reddit.com") > -1) {
	// 	return crawlReddit({url: url});
	// } else if(domain.indexOf("imgur.com") > -1) {
	// 	return crawlImgur({url: url});
	// }

	//etc

	// else {
		return crawlEmbedly({url: url, userId: userId});
	// }
};
 

module.exports = {

	crawl: function (url, userId) {

		return new Promise(function (fulfill, reject) {
			var domain = Url.parse(url).hostname;

			crawlOptions(domain, url, userId).then(function (result) {
				fulfill(result);
			});

		});
	}
};