module.exports = {
	"development": {
		"define": {
			"API_ENDPOINT": JSON.stringify("http://mochiya98.starfree.jp/api/v1/hw_manager"),
			"API_ENDPOINT": JSON.stringify("https://ss1.xrea.com/wvagc.s1001.xrea.com/api/v1/hw_manager"),
		},
	},
	"production": {
		"define": {
			"API_ENDPOINT": JSON.stringify("https://ss1.xrea.com/wvagc.s1001.xrea.com/api/v1/hw_manager"),
		},
	},
};
