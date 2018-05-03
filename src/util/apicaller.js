import querystring from "querystring";

export default class {
	constructor(arg_endpoint){
		this.endpoint = arg_endpoint;
	}
	_gen(path, params, callback, method){
		if(DEBUG){
			console.log(`ApiCaller:[${method}]${path}`, params, callback);
		}
		const xhr = new XMLHttpRequest();
		xhr.responseType = "text";
		xhr.timeout = 10000;

		let href = this.endpoint + path;
		if(method === "GET"){
			href += "?" + querystring.stringify(params);
		}
		xhr.open(method, href);

		xhr.onerror =
		xhr.ontimeout = function(e){
			callback(e, null);
		};

		xhr.onload = ()=>{
			//if(DEBUG) console.log(xhr.responseText);
			const {error, result} = JSON.parse(xhr.responseText);
			callback(error, result);
		};

		if(method === "GET"){
			xhr.send();
		}else if(method === "POST"){
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(querystring.stringify(params));
		}
	}
	get(path, params, callback){
		this._gen(path, params, callback, "GET");
	}
	post(path, params, callback){
		this._gen(path, params, callback, "POST");
	}
}
