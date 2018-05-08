const {getLocationHash} = require("./common");

const assertPathValid = {
	home: function(page){
		const lpath = getLocationHash(page);
		const hash_match =
			lpath.match(/^(?:\/|)$/);
		if(!hash_match)throw new URIError(`assertPathValid Failed: home (${lpath})`);
	},
	hwdetail: function(page){
		const lpath = getLocationHash(page);
		const hash_match =
			lpath.match(/^\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
		if(!hash_match)throw new URIError(`assertPathValid Failed: hwdetail (${lpath})`);
	},
	hwedit: function(page){
		const lpath = getLocationHash(page);
		const hash_match =
			lpath.match(/^\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/edit$/);
		if(!hash_match)throw new URIError(`assertPathValid Failed: hwedit (${lpath})`);
	},
};
module.exports = assertPathValid;
