var Collection = {
	schema: true,

	attributes: {
		baseScore: {type: "integer"},
		upvotes: {type: "integer"},
		downvotes: {type: "integer"},
		sticky: {type: "boolean"},

		postedBy: {model: "User"},

		title: {type: "string"},
		description: {type, "string"},


		// links: {
		// 	collection: "LinkUrl",
		// 	via: "memberOf"
		// },


		groups: {
			collection: "Group",
			via: "ownedBy"
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