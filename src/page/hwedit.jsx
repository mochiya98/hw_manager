import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import {subjectList} from "../constant/";
import {
	getAbsoluteDateState,
	getTodayDate,
	unixtime2date,
} from "util/dateparser";
import notifier from "util/notifier";
import HwCardBtn from "component/hwcardbtn";

export default ({match}) => ($state, $actions) => {
	const state = $state.page.hwedit;
	const actions = $actions.page.hwedit;
	const hwid = match.params.hw_id;
	let hw = $state.hw_manager.hws[match.params.hw_id];
	let elSCodeInput;
	let elNoInput;
	let elTitleInput;
	let elDateInput;
	if(state.sendingHw){
		hw = state.sendingHw;
	}
	if(!hw){
		hw = {
			comments: [],
			expire  : getTodayDate() + 7,
			id      : hwid,
			no      : 1,
			s_code  : "IW31",
			title   : "",
		};
	}
	const si = subjectList.indexOf(hw.s_code);

	function initElSCodeInput(e){
		elSCodeInput = e;
	}
	function initElNoInput(e){
		elNoInput = e;
	}
	function initElTitleInput(e){
		elTitleInput = e;
	}
	function initElDateInput(e){
		elDateInput = e;
	}
	function onSCodeSelectUpdate(e){
		const isEtc = e.target.value === "";
		elSCodeInput.disabled = !isEtc;
		elSCodeInput.value = e.target.value;
	}
	function onSaveButtonClick(event){
		hw = {...hw};
		const s_code = elSCodeInput.value;
		const no_txt = elNoInput.value;
		let title = elTitleInput.value;
		const date_txt = elDateInput.value;
		
		if(title === ""){
			title = "主題未設定";
		}
	
		if(s_code === "" || s_code.length > 6){
			notifier.Show("科目記号が入力されていないか、長すぎます", "error");
			return;
		}
		if(!no_txt.match(/^[0-9]+$/)){
			notifier.Show("課題番号は数字で入力して下さい", "error");
			return;
		}
		const no = no_txt * 1;
		if(!(no >= 1 && no <= 99)){
			notifier.Show("課題番号は1~99で入力して下さい", "error");
			return;
		}
		console.log(no);
		if(date_txt === ""){
			notifier.Show("期限が入力されていません", "error");
			return;
		}
		if(!date_txt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)){
			notifier.Show("期限はYYYY-MM-DD形式で入力して下さい", "error");
			return;
		}
	
		hw.s_code = s_code;
		hw.no = no;
		hw.title = title;
		hw.expire = unixtime2date(new Date(date_txt) * 1, true);
		
		$actions.hw_manager.sendEdit({
			callback: (e, r)=>{
				if(!e){
					location.actions.go("/");
				}
				actions.updateSendingHw(null);
				actions.updateIsSending(false);
			},
			hw,
		});
		actions.updateSendingHw(hw);
		actions.updateIsSending(true);
	}
	return (
		<div class="page-hwedit" data-test="page-hwedit">
			<div className="hwcard">
				<h2>課題の登録/編集</h2>
				<div className="hwcard-editpanel">
					<h3>科目記号</h3>
					<div className="hwedit-scodeform">
						<select
							selectedIndex={si !== -1 ? si : subjectList.length}
							onchange={onSCodeSelectUpdate}
							data-test="hwedit-scode-select"
						>
							{subjectList.map((val)=>(
								<option value={val}>{val}</option>
							))}
							<option value="">その他</option>
						</select>
						<input
							className="hwedit-scodeinput"
							value={hw.s_code}
							disabled={si !== -1}
							oncreate={initElSCodeInput}
							onupdate={initElSCodeInput}
							data-test="hwedit-scode-input"
						/>
					</div>
					<h3>課題番号</h3>
					<input
						className="hwedit-noinput"
						style={{width: "100%"}}
						type="number"
						min="1"
						max="99"
						value={hw.no}
						oncreate={initElNoInput}
						onupdate={initElNoInput}
						data-test="hwedit-no-input"
					/>
					<h3>主題</h3>
					<input
						className="hwedit-titleinput"
						style={{width: "100%"}}
						value={hw.title}
						oncreate={initElTitleInput}
						onupdate={initElTitleInput}
						data-test="hwedit-title-input"
					/>
					<h3>期限</h3>
					<input
						className="hwedit-dateinput"
						type="date"
						pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
						value={getAbsoluteDateState(hw.expire, "-")}
						oncreate={initElDateInput}
						onupdate={initElDateInput}
						data-test="hwedit-date-input"
					/>
				</div>
				<div className="hwcard-editcp">
					<HwCardBtn
						loading={state.isSending}
						stretch
						onclick={(e)=>onSaveButtonClick(e)}
						data-test="hwedit-savebtn"
					>
						保存する
					</HwCardBtn>
				</div>
				<hr />
				<div className="hwcard-historyback">
					<HwCardBtn
						stretch
						onclick={()=>history.back()}
					>
						前のページに戻る
					</HwCardBtn>
				</div>
			</div>
		</div>
	);
};
