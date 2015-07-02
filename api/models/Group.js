var Group = {
	schema: true,

	attributes: {

		name: {type: "string"}, 
		order: {type: "integer"},

		ownedLinks: {
			collection: "LinkMeta",
			via: "memberOf"
		},

		memberOf: {
			model: "collection"
		}

	}
}

module.exports = Group;