const generateUuid = require("../generate_uuid");

const {_testSelector, assertTextContent, getTextContent, gotoHash, overrideDialogMethods, typeAfterClear, waitForNotify, waitFrame} = require("../common");
const {strict:assert} = require("assert");

class E2EMan_HwDetail{
	constructor(page){
		this.page = page;
	}
	async goto(uuid = generateUuid()){
		await gotoHash(this.page, "");
		const waitPromise = this.page.waitForNavigation();
		await gotoHash(this.page, `/hws/${uuid}`);
		await waitPromise;
		await this.page.waitForSelector(_testSelector("page-hwdetail"));
	}
	async assert(hwdisp = {}){
		await assertTextContent(this.page, _testSelector("hwdetail-s_code"), hwdisp.s_code);
		await assertTextContent(this.page, _testSelector("hwdetail-no"), "No." + hwdisp.no);
		await assertTextContent(this.page, _testSelector("hwdetail-title"), hwdisp.title);
		await assertTextContent(this.page, _testSelector("hw_card_base-exp-aday"), hwdisp.date);
		const comments_text = await getTextContent(
			this.page,
			_testSelector("hwdetail-comments")
		);
		if(Array.isArray(hwdisp.comments)){
			for(const comment of hwdisp.comments){
				if(!comments_text.includes(comment)){
					assert.fail(`comment doesn't matched: "${comment}"`);
				}
			}
		}
	}
	async addComment(comment = "", waitNotifyType = null){
		await typeAfterClear(this.page, _testSelector("hwdetail-comment_input__input"), comment);
		await this.page.click(_testSelector("hwdetail-comment_input__sendbtn"));
		while(
			!(await getTextContent(
				this.page,
				_testSelector("hwdetail-comments")
			)).includes(comment)
		)await waitFrame();
		if(waitNotifyType !== null){
			await waitForNotify(this.page, waitNotifyType);
		}
	}
	async removeHw(accept = null, waitNotifyType = null){
		if(accept !== null){
			overrideDialogMethods(this.page, accept);
		}
		this.page.click(_testSelector("hwdetail-removebtn"));
		if(waitNotifyType !== null){
			await waitForNotify(this.page, waitNotifyType);
		}
	}
}
module.exports = E2EMan_HwDetail;
