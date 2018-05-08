const fs = require("fs");
const url = require("url");
const path = require("path");
const {strict:assert} = require("assert");

const mime = require("mime");
const devices = require("puppeteer/DeviceDescriptors");

const useRequestStub = true;
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

function _testSelector(id){
	return `[data-test="${id}"]`;
}

async function newPage(browser){
	let page = await browser.newPage();
	let device = devices["Nexus 5"];
	await page.emulate(device);
	/*const {targetInfos: [{targetId}]} =
		await browser._connection.send("Target.getTargets");
	const {windowId} =
		await browser._connection.send(
			"Browser.getWindowForTarget",
			{targetId}
		);
	await browser._connection.send(
		"Browser.setWindowBounds", {
			bounds: {
				height: 800,
				width : 412,
			},
			windowId,
		}
	);*/
	await page.exposeFunction("_testSelector", _testSelector);
	if(useRequestStub){
		await page.setRequestInterception(true);
		page.on("request", req => {
			const r_url = new url.URL(req.url());
			const method = req.method();
			if(req.resourceType() !== "xhr"){
				if(r_url.host === "127.0.0.1"){
					if(r_url.pathname[r_url.pathname.length - 1] === "/"){
						r_url.pathname += "index.html";
					}
					const filepath = path.resolve("./dist/", "." + r_url.pathname);
					try{
						const body = fs.readFileSync(filepath);
						req.respond({
							body,
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
				(method === "POST" && r_url.pathname.match(/\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
				|| (method === "POST" && r_url.pathname.match(/\/hws\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/edit$/))
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
		});
	}
	return page;
}
async function openPage(page, args = ""){
	await page.goto(
		`http://127.0.0.1/index.html${args}`,
		{waitUntil: "networkidle2"}
	);
}
function getLocationHash(page){
	return page.url().match(/(?:(?<=#).+|)$/)[0];
}
async function gotoHash(page, hash){
	await page.evaluate(function(h){
		location.hash = h;
	}, hash);
}

async function assertValue(page, selector, assert_value){
	const value = await getValue(page, selector);
	assert.equal(value, String(assert_value));
}
async function assertTextContent(page, selector, assert_value){
	const value = await getTextContent(page, selector);
	assert.equal(value.trim(), String(assert_value));
}

async function clearValue(page, selector){
	await page.evaluate(function(s){
		document.querySelector(s).value = "";
	}, selector);
}
async function setValue(page, selector, value){
	await page.evaluate(function({sel, val}){
		document.querySelector(sel).value = val;
	}, {sel: selector, val: value});
}
async function getTextContent(page, selector){
	return await page.evaluate(function(s){
		return document.querySelector(s).textContent;
	}, selector);
}
async function getValue(page, selector){
	const elHandle = await page.$(selector);
	const jsHandle = await elHandle.getProperty("value");
	const value = await jsHandle.jsonValue();
	await jsHandle.dispose();
	await elHandle.dispose();
	return value;
}

async function typeAfterClear(page, selector, value){
	await clearValue(page, selector);
	if(value !== void 0 && value !== null){
		await page.type(selector, String(value));
	}
}

async function waitForNotify(page, type){
	await page.waitForSelector(_testSelector("notify-popup") + ".disp." + type);
	await page.waitForSelector(_testSelector("notify-popup") + ":not(.disp)");
}
async function waitForTextContent(page, selector, text){
	// eslint-disable-next-line no-shadow
	await page.waitForFunction(function({selector, text}){
		let elInp = document.querySelector(selector);
		return elInp && elInp.textContent.includes(text);
	}, {}, {selector, text});
}
function waitFrame(){
	return new Promise(r=>setTimeout(r, 16));
}

// on("dialog",...)がうまく動作しなかったので代替策
async function overrideDialogMethods(page, accept = true, promptText = null){
	//eslint-disable-next-line no-shadow
	await page.evaluate(function({accept, promptText}){
		window.alert = ()=>{};
		window.confirm = ()=>accept;
		window.prompt = ()=>accept && promptText;
	}, {accept, promptText});
}

module.exports = {_testSelector, assertTextContent, assertValue, clearValue, getLocationHash, getTextContent, getValue, gotoHash, newPage, openPage, overrideDialogMethods, setValue, typeAfterClear, waitForNotify, waitForTextContent, waitFrame};
