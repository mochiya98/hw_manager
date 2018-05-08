const config={
	"ignore": [
	  "^./node_modules"
	],
	"presets": [
		["@babel/preset-env", {
			"loose": true,
			"modules": false,
			"debug": false,
			"targets": {
			"browsers": [ "> 0.5% in JP", "not op_mini all", "not ie 11"],
			},
		}]
	],
	"plugins": [
		["transform-react-jsx",{
			"pragma": "h"
		}],
	]
};
if(process.env.MOCHA){
	config.presets.find(c=>c[0]==="@babel/preset-env")[1].modules="commonjs";
}
if(process.env.NODE_ENV==="production"){
	config.plugins.push(
		["remove-test-ids",{
			"attributes": ["data-test"]
		}]
	);
}
module.exports=config;