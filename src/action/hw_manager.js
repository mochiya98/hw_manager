import {location} from "hyperapp-hash-router";

import htmlspecialchars from "htmlspecialchars";

import notifier from "util/notifier";
import ApiCaller from "util/apicaller";
import {getTodayDate} from "util/dateparser";
import generateUuid from "util/generateuuid";

const api = new ApiCaller(API_ENDPOINT);

export default {
	init: value => (state, actions) => {
		api.get("/hws", {}, (e, r)=>{
			if(e){
				notifier.t("読み込み", true);
				return;
			}
			if(DEBUG){
				console.log(r);
			}
			actions.updateHws(r);
		});
	},
	removeHw: ({hw, callback}) => ({hws}, actions) => {
		if(DEBUG) console.log("removeHw", hw);

		api.post(`/hws/${hw.id}`, {_method: "DELETE"}, (e, r)=>{
			const hasError = e || r.status !== "ok";
			notifier.t("課題の削除", hasError);

			if(!hasError){
				delete hws[hw.id];
				location.actions.go("/");
			}
			actions.updateHws(hws);
			if(callback) callback(e || hasError, r);
		});
	},
	sendComment: ({hwid, comment, callback}) => ({hws, hws_future, hws_expired}, actions) => {
		if(DEBUG) console.log("sendComment", hwid, comment);
		if(typeof hwid === "object")hwid = hwid.id;
		if(!comment)return;

		const comment_id = generateUuid();
		const options = {
			_method: "PUT",
			comment,
		};
		api.post(`/hws/${hwid}/comments/${comment_id}`, options, (e, r)=>{
			const hasError = e || r.status !== "ok";
			notifier.t("コメントの送信", hasError);

			if(!hasError){
				hws[hwid].comments.push({
					id   : comment_id,
					value: htmlspecialchars(comment),
				});
			}
			actions.updateHws(hws);
			if(callback) callback(e || hasError, r);
		});
	},
	sendEdit: ({hw, callback}) => ({hws}, actions) => {
		if(DEBUG) console.log("sendEdit", hw);

		const {id, s_code, no, title, expire} = hw;
		const options = {
			_method: "PUT",
			expire,
			no,
			s_code,
			title,
		};
		api.post(`/hws/${id}`, options, (e, r)=>{
			const hasError = e || r.status !== "ok";
			notifier.t("課題の登録/編集", hasError);

			if(!hasError){
				hws[hw.id] = hw;
			}
			actions.updateHws(hws);
			if(callback) callback(e || hasError, r);
		});
	},
	updateHws: (hws_list) => state => {
		const hws = {},
			hws_expired = [],
			hws_future = [];
		const now = getTodayDate();
		
		for(const i in hws_list){
			const hw = hws_list[i];
			const relativeDate = (hw.expire - now);
			if(relativeDate < 0){
				hws_expired.push(hw);
			}else{
				hws_future.push(hw);
			}
			hws[hw.id] = hw;
		}
		
		//document.body.classList.remove("loading");
		
		return {
			hws,
			hws_expired,
			hws_future,
			loading: false,
		};
	},
};
