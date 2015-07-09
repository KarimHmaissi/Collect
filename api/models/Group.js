var Group = {
	schema: true,

	attributes: {

		name: {type: "string", notEmpty: true}, 
		order: {type: "integer", notEmpty: true},

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