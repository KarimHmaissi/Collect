
var testProperty = function (object, property, testString) {
	if(object.hasOwnProperty(property)) {
		if(!object[property]) {
			return false;
		}

		if(!testString) {
			if(object[property] === "") {
				return false;
			}
		}

		return true;
	}

	return false;
};


var validateNewCollection = function (collection) {
	
	var self = this;

	//test meta	
	if(!self.testProperty(collection, "title", false)) {
		return false;
	}

	if(!self.testProperty(collection, "description", true)) {
		return false;
	}

	if(!self.testProperty(collection, "groups", false)) {
		return false;
	}

	if(collection.groups.length < 1) {
		return false;
	}

	_.forEach(collection.groups, function (n, group) {
		if(!self.testProperty(group, "name", false)) {
			return false;
		}

		if(!self.testProperty(group, "order", true)) {
			return false;
		}

		_.forEach(group.links, function (n, linkMeta) {
			if(!self.testProperty(linkMeta, "title", false)) {
				return false;
			}

			if(!self.testProperty(linkMeta, "linkUrl", true)) {
				return false;
			}
		});

	});

	return true;
	
};

module.exports = {
	testProperty: testProperty,
	validateNewCollection: validateNewCollection
}