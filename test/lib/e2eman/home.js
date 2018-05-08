const {_testSelector, gotoHash} = require("../common");
const assertPathValid = require("../assert_path_valid");

class E2EMan_Home{
	constructor(page){
		this.page = page;
	}
	async goto(){
		await gotoHash(this.page, "/");
		await this.page.waitForSelector(_testSelector("page-home"));
	}
	async newHomework(){
		const waitPromise = this.page.waitForNavigation();
		await this.page.click(_testSelector("home-hw-addbtn"));
		await waitPromise;
		assertPathValid.hwedit(this.page);
		await this.page.waitForSelector(_testSelector("page-hwedit"));
	}
	async switchHwsTypeSS(id){
		await this.page.click(
			_testSelector("home-ss-hws_type")
			+ " "
			+ _testSelector(`ss-label-${id}`)
		);
	}
}
module.exports = E2EMan_Home;
