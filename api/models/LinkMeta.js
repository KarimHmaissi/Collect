var LinkMeta = {
	schema: true,

	attributes: {

		title: {type: "string", defaultsTo: ""},
		description: {type: "string", defaultsTo: ""},
		// group: {type: "string", defaultsTo: "misc"},

		moderated: {type: "boolean", defaultsTo: true},

		linkUrl: {
			model: "linkUrl"
		},

		memberOf: {
			model: "group"
		}

	}
}

module.exports = LinkMeta;