var LinkMeta = {
	schema: true,

	attributes: {

		title: {type: "string", defaultsTo: ""},
		description: {type: "string", defaultsTo: ""},

		linkUrl: {
			model: "linkUrl"
		},

		memberOf: {
			model: "group"
		}

	}
}

module.exports = LinkMeta;