
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



/* Adss links to appropiate group */
var addLinksToGroups = function (linkMetas, groups) {
	var i,j,
		groupLength = groups.length,
		linkmetasLength = linkMetas.length;

	for(i =0; i < linkmetasLength; i ++) {

		sails.log(i);

		for(j = 0; j < groupLength; j++) {
			if(i === 0) {
				groups[j]["ownedLinks"]= [];
				groups[j].links = [];
				sails.log("new links array");
			}	

			if(groups[j].id === linkMetas[i].memberOf) {
				sails.log("adding linkMeta to collection.group");
				groups[j].links.push(linkMetas[i]);
				sails.log("new links added");
			}

		}

	}

};

// stubbed
var validateGroup = function (group) {
	

	return true;	
};

module.exports = {
	testProperty: testProperty,
	validateNewCollection: validateNewCollection,
	validateGroup: validateGroup,
	addLinksToGroups: addLinksToGroups
}