
var Url = require("url");
var Request = require("request");
var Promise = require("bluebird");
var Bottleneck = require("bottleneck");

var embedlyLimiter = new Bottleneck(1, 67);

var embedlyKey = "";
var iframleyUrl = "http://localhost:8061/iframely";


var crawlMain = function (domain, url, userId) {
	
	//get domain from reddis
	//check time last queried 

	// if more than 1 second ago
		//call iframley
		// return crawlIframley({url: url, userId: userId, domain: domain});
	// else

		//call embedly
		return crawlEmbedly({url: url, userId: userId, domain: domain});



};


var crawlIframley = function (result) {

	return new Promise(function (fulfill, reject) {


		result.apiCall = iframleyUrl + "?url=" + result.url;

		Request(result.apiCall, function (error, response, body) {

			if(!error && response.statusCode === 200) {

				var parsedBody = JSON.parse(body);
				
				var linkUrl = {
					url: result.url,
					title: parsedBody.meta.title,
					description: "",
					thumbnail: "",
					providerUrl: "",
					providerName: "",
					providerDisplay: "",
					embedHtml: "",
					embedPresent: false,
					postedBy: result.userId
				};

				//description
				if(CollectionUtility.testProperty(parsedBody.meta, "description", true)) {
					linkUrl.description = parsedBody.meta.description;
				}

				//provider
				if(CollectionUtility.testProperty(parsedBody.meta, "site", true)) {
					linkUrl.providerUrl = parsedBody.meta.site;
					linkUrl.providerName = parsedBody.meta.site;
					linkUrl.providerDisplay = parsedBody.meta.site;
				}

				

				if(CollectionUtility.testProperty(parsedBody, "links", false)) {


					if(parsedBody.links.length > 0) {

						if(CollectionUtility.testProperty(parsedBody, "html", true)) {
							linkUrl.embedHtml = parsedBody.html;
							linkUrl.embedPresent = true;
							linkUrl.embedType = "html";
						}

						sails.log("looking for a thumbnail");

						//thumbnail && html embed
						_.forEach(parsedBody.links, function (link, n) {

							sails.log("looping over links");
							sails.log(link);
							sails.log(n);
							sails.log(linkUrl.thumbnail);
							sails.log(link.type);

							//thumbnail
							if(link.type === "image" && linkUrl.thumbnail === "") {
								_.forEach(link.rel, function (rel, n) {
									
									sails.log("found a link of type image");

									if(rel != "icon") {
										sails.log("image is not an icon");

										if(rel === "thumbnail" || rel === "image") {
											sails.log("rel contains thumbnail or image saving ++++");

											linkUrl.thumbnail = link.href;
										}
									}

								});

							}

							//html embed
							if(link.type === "text/html" && !linkUrl.embedPresent) {
								linkUrl.embedHtml = link.html;
								linkUrl.embedPresent = true;
								linkUrl.embedType = "html";
							}

						});

						sails.log("finished searching END ---------------------");

					}


				}


			} else {

				sails.log(error);
				sails.log("wtf????");
				// sails.log(response.statusCode);
				result.err = "Did not receive a valid response from iframley server";
				fulfill(result);
			}

			



			// on finish	
			//save new time to reddis domain entry
			// save item to db

			saveLink(linkUrl, result, fulfill);
		});

	
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
				};

			
				//thumbnail
				if(parsedBody.images.length > 0) {
					sails.log("found image!");
					sails.log(parsedBody.images[0].url);
					linkUrl.thumbnail = parsedBody.images[0].url;
				}

				//embedly embed
				if(typeof parsedBody.media.type === "string") {

					if(parsedBody.media.type === "video") {
						linkUrl.embedHtml = parsedBody.media.html;
						linkUrl.embedType = parsedBody.media.type;
						linkUrl.embedPresent = true;

					} else if(parsedBody.media.type === "photo") {

						linkUrl.embedHtml = "<img src='" + parsedBody.media.url + "' />";
						linkUrl.embedType = parsedBody.media.type;
						linkUrl.embedPresent = true;
					}
				}

				sails.log("Got a response!");
				sails.log(linkUrl);

				saveLink(linkUrl, result, fulfill);


			} else {
				result.err = "Did not receive a valid response from Embedly.com";
				fulfill(result);
			}

		});

		
	});
};


var saveLink = function (linkUrl, result, fulfill) {
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
};



module.exports = {
	crawl: function (url, userId) {
		return new Promise(function (fulfill, reject) {
			var domain = Url.parse(url).hostname;

			crawlMain(domain, url, userId).then(function (result) {
				fulfill(result)
			});
		});
	}
}
