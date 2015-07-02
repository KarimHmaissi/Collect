var Group = {
	schema: true,

	attributes: {

		name: {type: "string"}, 
		order: {type: "integer"},

		links: {
			collection: "LinkMeta",
			via: "memberOf"
		},

		memberOf: {
			model: "collection"
		}

	}
}

module.exports = LinkMeta;