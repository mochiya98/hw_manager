import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import {subjectList} from "../constant/";
import {
	getAbsoluteDateState,
	getTodayDate,
	unixtime2date,
} from "util/dateparser";
import notifier from "util/notifier";

function onSCodeSelectUpdate(e){
	const isEtc = e.target.value === "";
	const scodeinput = e.target.parentNode.getElementsByClassName("hwedit-scodeinput")[0];
	scodeinput.disabled = !isEtc;
	scodeinput.value = e.target.value;
}
function onSaveButtonClick({e, hw, actions}){
	function getValueByClassName(className){
		const hwcard = e.target.parentNode.parentNode;
		return hwcard.getElementsByClassName(className)[0].value;
	}

	hw = {...hw};
	const s_code = getValueByClassName("hwedit-scodeinput");
	const no_txt = getValueByClassName("hwedit-noinput");
	let title = getValueByClassName("hwedit-titleinput");
	const date_txt = getValueByClassName("hwedit-dateinput");
	
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
	}
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
	
	actions.hw_manager.sendEdit(hw);
}

export default ({hwid, hw}) => {
	hw = hw ? hw : {
		comments: [],
		expire  : getTodayDate() + 7,
		id      : hwid,
		no      : 1,
		s_code  : "IW31",
		title   : "",
	};
	const si = subjectList.indexOf(hw.s_code);
	return (state, actions) => (
		<div className="hwcard">
			<h2>課題の登録/編集</h2>
			<div className="hwcard-editpanel">
				<h3>科目記号</h3>
				<div className="hwedit-scodeform">
					<select
						selectedIndex={si !== -1 ? si : subjectList.length}
						onChange={onSCodeSelectUpdate}
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
				/>
				<h3>主題</h3>
				<input
					className="hwedit-titleinput"
					style={{width: "100%"}}
					value={hw.title}
				/>
				<h3>期限</h3>
				<input
					className="hwedit-dateinput"
					type="date"
					pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
					value={getAbsoluteDateState(hw.expire, "-")}
				/>
			</div>
			<div className="hwcard-editcp">
				<button
					className="hwcard-btn hwcard-btn--stretch"
					onclick={(e)=>onSaveButtonClick({actions, e, hw})}
				>
					保存する
				</button>
			</div>
			<hr />
			<div className="hwcard-historyback">
				<button
					className="hwcard-btn hwcard-btn--stretch"
					onclick={()=>history.back()}
				>
					前のページに戻る
				</button>
			</div>
		</div>
	);
};