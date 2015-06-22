var Collection = {
	schema: true,

	attributes: {
		baseScore: {type: "integer", defaultsTo: 0},
		upvotes: {type: "integer", defaultsTo: 0},
		downvotes: {type: "integer", defaultsTo: 0},
		sticky: {type: "boolean", defaultsTo: false},

		postedBy: {model: "User"},

		title: {type: "string"},
		description: {type: "string", defaultsTo: ""},


		// links: {
		// 	collection: "LinkUrl",
		// 	via: "memberOf"
		// },


		links: {
			collection: "LinkMeta",
			via: "memberOf"
		},


		upvoters: {
			collection: "User",
			via: "upvoted"
		},
 
		downvoters: {
			collection: "User",
			via: "downvoted"
		},

		// tags: {
		// 	collection: "tags"
		// }

	}
}

module.exports = Collection;