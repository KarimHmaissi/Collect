var LinkMeta = {
	schema: true,

	attributes: {

		title: {type: "string", defaultsTo: ""},
		description: {type: "string", defaultsTo: ""},
		group: {type: "string", defaultTo: "misc"},

		linkUrl: {
			model: "linkUrl"
		},

		memberOf: {
			model: "collection"
		}

	}
}

module.exports = LinkMeta;