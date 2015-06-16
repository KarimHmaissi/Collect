/**
 * CollectionController
 *
 * @description :: Server-side logic for managing Collections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	restricted: function (req, res) {
		return res.ok("hit collection/restricted brap")
	},

	open: function (req, res) {
		return res.ok("hit collection/open");
	}

};

