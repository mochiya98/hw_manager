import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import HwCardBase from "./hwcardbase";

function onCommentSendBtnClick(e, hw, actions){
	const hwcard = e.target.parentNode.parentNode;
	const commentTa = hwcard.getElementsByClassName("hwcard-comment-ta")[0];
	actions.hw_manager.sendComment({
		comment: commentTa.value,
		hwid   : hw.id,
	});
	commentTa.value = "";
}

function onRemoveBtnClick(e, hw, actions){
	if(!confirm("本当にこの課題を削除しますか？"))return;
	if(!confirm("本当に本当に、この課題を削除しますか？"))return;
	actions.hw_manager.removeHw(hw);
}

export default ({hw}) => {
	if(!hw){
		return (state, actions) => (
			<div className="hwcard">
				<p>削除済みの課題です</p>
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
	}
	return (state, actions) => (
		<HwCardBase hw={hw}>
			<div className="hwcard-fulldesc">
				<div className="control">
					<button
						className="hwcard-btn removebtn"
						onclick={(e)=>onRemoveBtnClick(e, hw, actions)}
					>
						削除
					</button>
					<button
						className="hwcard-btn editbtn"
						onclick={()=>location.actions.go("/hws/" + hw.id + "/edit")}
					>
						編集
					</button>
				</div>
				<div className="s_code">{hw.s_code}</div>
				<div className="no">No.{hw.no}</div>
				<h1 className="title">{hw.title}</h1>
			</div>
			<hr />
			<ul className="hwcard-commentlist">
				{hw.comments.map((comment)=>(
					<li innerHTML={comment.value.replace(/\n/g, "<br>")}></li>
				))}
			</ul>
			<div className="hwcard-commentinput">
				<textarea rows={4} className="hwcard-comment-ta"></textarea>
			</div>
			<div className="hwcard-commentinput">
				<button
					className="hwcard-btn hwcard-btn--stretch"
					onclick={(e)=>onCommentSendBtnClick(e, hw, actions)}
				>
					コメント送信
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
		</HwCardBase>
	);
};
