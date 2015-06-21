var Collection = {
	schema: true,

	attributes: {
		baseScore: {type: "integer"},
		upvotes: {type: "integer"},
		downvotes: {type: "integer"},
		sticky: {type: "boolean"},

		postedBy: {model: "User"},




		links: {
			collection: "LinkUrl",
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