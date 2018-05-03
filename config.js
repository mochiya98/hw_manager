module.exports = {
	"development": {
		"define": {
			"API_ENDPOINT": JSON.stringify("http://127.0.0.1:3014/api/v1/hw_manager"),
		},
	},
	"production": {
		"define": {
			"API_ENDPOINT": JSON.stringify("http://127.0.0.1:3014/api/v1/hw_manager"),
		},
	},
};
