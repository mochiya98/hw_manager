import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import HwCardBase from "component/hwcardbase";
import HwCardBtn from "component/hwcardbtn";

export default ({match}) => ($state, $actions) => {
	const state = $state.page.hwdetail;
	const actions = $actions.page.hwdetail;
	const hw = $state.hw_manager.hws[match.params.hw_id];
	function onCommentSendBtnClick(event){
		const hwcard = event.target.parentNode.parentNode;
		const commentTa = hwcard.getElementsByClassName("hwcard-comment-ta")[0];
		if(commentTa.value !== ""){
			$actions.hw_manager.sendComment({
				callback: (e, r)=>{
					actions.updateIsCommentSending(false);
				},
				comment: commentTa.value,
				hwid    : hw.id,
			});
			commentTa.value = "";
			actions.updateIsCommentSending(true);
		}
	}
	function onRemoveBtnClick(e){
		if(!confirm("本当にこの課題を削除しますか？"))return;
		if(!confirm("本当に本当に、この課題を削除しますか？"))return;
		$actions.hw_manager.removeHw({
			callback: (e, r)=>{
				if(!e){
					location.actions.go("/");
				}
				actions.updateIsHomeworkRemoving(false);
			},
			hw,
		});
		actions.updateIsHomeworkRemoving(true);
	}

	if(!hw){
		return (
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
	return (
		<HwCardBase hw={hw}>
			<div className="hwcard-fulldesc">
				<div className="control">
					<HwCardBtn
						className="removebtn"
						loading={state.isHomeworkRemoving}
						onclick={(e)=>onRemoveBtnClick(e, hw)}
					>
							削除
					</HwCardBtn>
					<HwCardBtn
						className="editbtn"
						onclick={()=>location.actions.go("/hws/" + hw.id + "/edit")}
					>
							編集
					</HwCardBtn>
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
				<HwCardBtn
					stretch
					disabled={state.isHomeworkRemoving}
					loading={state.isCommentSending}
					onclick={(e)=>onCommentSendBtnClick(e)}
				>
						コメント送信
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
		</HwCardBase>
	);
};
