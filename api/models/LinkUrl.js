var LinkUrl = {
	schema: true,

	attributes:  {
		url: {type: "string", url: true, notEmpty: true},

		providerUrl: {type: "string", notEmpty: true},
		providerName: {type: "string"},
		providerDisplay: {type: "string"},

		title: {type: "string"},
		description: {type: "string"},
		thumbnail: {type: "string"},

		approved: {type: "boolean", defaultsTo: false},

		postedBy: {model: "User"},


		embedHtml: {type: "string", defaultsTo: ""},
		embedPresent: {type: "boolean", defaultsTo: false},
		embedType: {type: "string", defaultsTo: ""},

		// embed: {model: "Embed"},

		// memberOf: {
		// 	collection: "Collection",
		// 	via: "links"
		// },


		memberOfCollection: {type: "boolean", defaultsTo: false}
	}

	
}

module.exports = LinkUrl;