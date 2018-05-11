const puppeteer = require("puppeteer");
const {_testSelector, newPage, openPage, waitForTextContent} = require("./lib/common");
const assertPathValid = require("./lib/assert_path_valid");

/* eslint-disable no-undef */
/* eslint-disable no-invalid-this */

const E2EMan_HwDetail = require("./lib/e2eman/hwdetail");
const E2EMan_HwEdit = require("./lib/e2eman/hwedit");
const E2EMan_Home = require("./lib/e2eman/home");

describe("E2E Tests", function(){
	this.timeout(30000);
	this.slow(20000);
	let browser;
	before(async()=>{
		browser = await puppeteer.launch({
			args    : ["--no-sandbox", "about:blank"],
			//dumpio  : true,
			headless: false,
			slowMo  : 25,
			timeout : 0,
		});
	});
	after(async()=>{
		await browser.close();
	});

	
	describe("/", function(){
		let e2eman_home;
		let page;
		before(async()=>{
			page = await newPage(browser);
			await openPage(page);
			e2eman_home = new E2EMan_Home(page);
		});
		after(async()=>{
			await page.close();
		});
		it("switch and test future scop", async() => {
			await e2eman_home.goto();
			await e2eman_home.switchHwsTypeSS("hws_future");
			await waitForTextContent(page, _testSelector("home-hwlist"), "スタブ未来課題");
		});
		it("switch and test expired scope", async() => {
			await e2eman_home.goto();
			await e2eman_home.switchHwsTypeSS("hws_expired");
			await waitForTextContent(page, _testSelector("home-hwlist"), "スタブ過去課題");
		});
		it("new-homework action", async() => {
			await e2eman_home.goto();
			await e2eman_home.newHomework();
		});
	});
	describe("/hws/:hwid", function(){
		let e2eman_hwdetail;
		let page;
		before(async()=>{
			page = await newPage(browser);
			await openPage(page);
			e2eman_hwdetail = new E2EMan_HwDetail(page);
		});
		after(async()=>{
			await page.close();
		});
		it("hw-detail assertion", async() => {
			await e2eman_hwdetail.goto("00000000-0000-4000-8000-000000000000");
			await e2eman_hwdetail.assert({
				"s_code"  : "ST3E",
				"no"      : 44,
				"title"   : "スタブ未来課題",
				"date"    : "2020/05/15(金)",
				"comments": ["スタブコメント"],
			});
		});
		it("add comment", async() => {
			await e2eman_hwdetail.goto("00000000-0000-4000-8000-000000000000");
			await e2eman_hwdetail.addComment("追加コメント", "info");
		});
		it("editbtn action", async() => {
			await e2eman_hwdetail.goto("00000000-0000-4000-8000-000000000000");
			const waitPromise = page.waitForNavigation();
			page.click(_testSelector("hwdetail-editbtn"));
			await waitPromise;
			assertPathValid.hwedit(page);
			await page.waitForSelector(_testSelector("page-hwedit"));
		});
		it("deletebtn action", async() => {
			await e2eman_hwdetail.goto("00000000-0000-4000-8000-000000000000");
			const waitPromise = page.waitForNavigation();
			await e2eman_hwdetail.removeHw(true, "info");
			await waitPromise;
			assertPathValid.home(page);
			await page.waitForSelector(_testSelector("page-home"));
		});
	});
	describe("/hws/:hwid/edit", function(){
		let e2eman_hwedit;
		let page;
		before(async()=>{
			page = await newPage(browser);
			await openPage(page);
			e2eman_hwedit = new E2EMan_HwEdit(page);
		});
		after(async()=>{
			await page.close();
		});
		it("edit inherit value assertion", async() => {
			await e2eman_hwedit.goto("00000000-0000-4000-8000-000000000000");
			await e2eman_hwedit.assert({
				"s_code": "ST3E",
				"no"    : 44,
				"title" : "スタブ未来課題",
				"date"  : "2020-05-15",
			});
		});
		it("scode select: WP32", async() => {
			await e2eman_hwedit.testSCodeSelect("WP32", "WP32", true);
		});
		it("scode select: custom", async() => {
			await e2eman_hwedit.testSCodeSelect("", "", false);
		});
		it("an error occurred when scode is empty", async() => {
			await e2eman_hwedit.testInputSaveResult({s_code: null}, "error");
		});
		it("an error occurred when no is empty", async() => {
			await e2eman_hwedit.testInputSaveResult({no: null}, "error");
		});
		it("an error occurred when no = 0", async() => {
			await e2eman_hwedit.testInputSaveResult({no: 0}, "error");
		});
		it("an error occurred when no = 100", async() => {
			await e2eman_hwedit.testInputSaveResult({no: 100}, "error");
		});
		it("an error occurred when no = not_number", async() => {
			await e2eman_hwedit.testInputSaveResult({no: "ab"}, "error");
		});
		it("an error occurred when date is empty", async() => {
			await e2eman_hwedit.testInputSaveResult({date: null}, "error");
		});
		it("success save when valid", async() => {
			await e2eman_hwedit.testInputSaveResult({}, "info");
		});
	});
});
