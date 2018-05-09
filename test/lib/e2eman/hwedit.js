const generateUuid = require("../generate_uuid");

const {_testSelector, assertValue, gotoHash, clearValue, setValue, typeAfterClear, waitForNotify, waitFrame} = require("../common");

const dummyHwInp = {
	s_code: "XT31",
	no    : 1,
	title : "TestKadai",
	date  : "2019-09-14",
};

class E2EMan_HwEdit{
	constructor(page){
		this.page = page;
	}
	async goto(uuid = generateUuid()){
		const waitPromise = this.page.waitForNavigation();
		await gotoHash(this.page, `/hws/${uuid}/edit`);
		await waitPromise;
		await this.page.waitForSelector(_testSelector("page-hwedit"));
	}
	async assert(hwdisp = {}){
		hwdisp = Object.assign({
			...dummyHwInp,
			...hwdisp,
		});
		await assertValue(this.page, _testSelector("hwedit-s_code-input"), hwdisp.s_code);
		await assertValue(this.page, _testSelector("hwedit-no-input"), hwdisp.no);
		await assertValue(this.page, _testSelector("hwedit-title-input"), hwdisp.title);
		await assertValue(this.page, _testSelector("hwedit-date-input"), hwdisp.date);
	}
	async input(hwdisp = {}){
		hwdisp = Object.assign({
			...dummyHwInp,
			...hwdisp,
		});
		await this.page.select(_testSelector("hwedit-s_code-select"), "");
		await typeAfterClear(this.page, _testSelector("hwedit-s_code-input"), hwdisp.s_code);
		await typeAfterClear(this.page, _testSelector("hwedit-no-input"), hwdisp.no);
		await typeAfterClear(this.page, _testSelector("hwedit-title-input"), hwdisp.title);
		await clearValue(this.page, _testSelector("hwedit-date-input"));
		if(hwdisp.date){
			await setValue(this.page, _testSelector("hwedit-date-input"), hwdisp.date);
		}
	}
	async save(){
		await this.page.click(_testSelector("hwedit-savebtn"));
	}
	async testSCodeSelect(sel_val, inp_val, disabled){
		await this.goto();
		await this.page.select(_testSelector("hwedit-s_code-select"), sel_val);
		// eslint-disable-next-line no-shadow
		while(!await this.page.evaluate(async function({disabled, inp_val}){
			let elInp = document.querySelector(
				await _testSelector("hwedit-s_code-input")
			);
			return elInp && elInp.value === inp_val && !!elInp.disabled === disabled;
		}, {disabled, inp_val}))await waitFrame();
	}
	async testInputSaveResult(hw, type){
		await this.goto();
		await this.input(hw);
		await this.save();
		await waitForNotify(this.page, type);
	}
}
module.exports = E2EMan_HwEdit;
