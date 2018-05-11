const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require("querystring");

const mime = require("mime");

const stubHws = {
	"result": {
		"00000000-0000-4000-8000-000000000000": {
			"id"      : "00000000-0000-4000-8000-000000000000",
			"no"      : 44,
			"s_code"  : "ST3E",
			"title"   : "スタブ未来課題",
			"expire"  : 18397,
			"comments": [
				{
					"id"   : "11111111-0000-4000-8000-000000000000",
					"value": "スタブコメント",
				},
			],
		},
		"00000000-0000-4000-8000-111111111111": {
			"id"      : "00000000-0000-4000-8000-111111111111",
			"no"      : 33,
			"s_code"  : "ST3S",
			"title"   : "スタブ過去課題",
			"expire"  : 16801,
			"comments": [],
		},
	},
};

function requestInterceptor(req){
	const r_url = new url.URL(req.url());
	let method = req.method();
	const headers = req.headers();
	let body = {};
	if(headers["content-type"]){
		const contentType = headers["content-type"].split(";")[0].trim();
		if(contentType === "application/x-www-form-urlencoded"){
			body = querystring.parse(req.postData());
		}else if(contentType === "application/json"){
			body = JSON.parse(req.postData());
		}
	}
	if(body._method){
		method = body._method.toUpperCase();
		delete body._method;
	}
	if(req.resourceType() !== "xhr"){
		if(r_url.host === "127.0.0.1"){
			if(r_url.pathname[r_url.pathname.length - 1] === "/"){
				r_url.pathname += "index.html";
			}
			const filepath = path.resolve("./dist/", "." + r_url.pathname);
			try{
				const filedata = fs.readFileSync(filepath);
				req.respond({
					body       : filedata,
					contentType: mime.getType(filepath),
					headers    : {
						"Access-Control-Allow-Origin": "*",
					},
					status: 200,
				});
				return;
			}catch(e){}
		}
		req.continue();
		return;
	}
	if(method === "GET" && r_url.pathname.endsWith("/hws")){
		req.respond({
			body       : JSON.stringify(stubHws),
			contentType: "application/json",
			headers    : {
				"Access-Control-Allow-Origin": "*",
			},
			status: 200,
		});
		return;
	}
	if(
		(method === "DELETE" && r_url.pathname.match(/\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
		|| (method === "PUT" && r_url.pathname.match(/\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
		|| (method === "PUT" && r_url.pathname.match(/\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/comments\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
	){
		req.respond({
			body: JSON.stringify({
				"result": {
					"status": "ok",
				},
			}),
			contentType: "application/json",
			headers    : {
				"Access-Control-Allow-Origin": "*",
			},
			status: 200,
		});
		return;
	}
	req.continue();
}
module.exports = requestInterceptor;
