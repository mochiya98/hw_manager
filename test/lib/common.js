const {strict:assert} = require("assert");

const devices = require("puppeteer/DeviceDescriptors");

const requestInterceptor = require("./request_interceptor.js");

const useRequestInterceptor = true;

function _testSelector(id){
	return `[data-test="${id}"]`;
}

async function newPage(browser){
	let page = await browser.newPage();
	let device = devices["Nexus 5"];
	await page.emulate(device);
	const {targetInfos: [{targetId}]} =
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
	);
	await page.exposeFunction("_testSelector", _testSelector);
	if(useRequestInterceptor){
		await page.setRequestInterception(true);
		page.on("request", requestInterceptor);
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
