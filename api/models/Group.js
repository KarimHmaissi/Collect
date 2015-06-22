var Group = {
	schema: true,

	attributes: {

		links: {
			collection: "LinkMeta",
			via: "memberOf"
		},

		title: {type: "string"},

		ownedBy: {
			model: "collection"
		}

	}
}

module.exports = Group;