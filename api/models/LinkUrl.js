var LinkUrl = {
	schema: true,

	attributes:  {
		url: {type: "string"},

		providerUrl: {type: "string"},
		providerName: {type: "string"},
		providerDisplay: {type: "string"},

		title: {type: "string"},
		description: {type: "string"},
		thumbnail: {type: "string"},

		approved: {type: "boolean", defaultsTo: false},

		postedBy: {model: "User"},

		embed: {model: "Embed"},

		memberOf: {
			collection: "Collection",
			via: "links"
		},


		memberOfCollection: {type: "boolean", defaultsTo: false}
	}

	
}

module.exports = LinkUrl;