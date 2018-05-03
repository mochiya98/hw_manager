import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import HwCardTiny from "component/hwcardtiny";
import {generateUuid} from "util/generateuuid";

export default () => (state, actions) => {
	const tstate = state.page.home;
	const tactions = actions.page.home;
	function onScopeChange(){
		const selected_scope =
			document.forms.scope_selector.scope.value;
		tactions.updateCurrentScope(selected_scope);
	}
	function onAddButtonClick(){
		location.actions.go("/hws/" + generateUuid() + "/edit");
	}
	return (
		<div class="page-home">
			<form name="scope_selector">
				<ul class="scope_bar">
					<li>
						<input
							type="radio" name="scope" id="scope1"
							checked={tstate.current_scope === "hws_future"}
							value="hws_future"
							onchange={onScopeChange}
						/>
						<label for="scope1">今後の課題</label>
					</li>
					<li>
						<input
							type="radio" name="scope" id="scope2"
							checked={tstate.current_scope === "hws_expired"}
							value="hws_expired"
							onchange={onScopeChange}
						/>
						<label for="scope2">期限切れ</label>
					</li>
				</ul>
			</form>
			{(() => {
				if(tstate.current_scope === "hws_future"){
					return (
						<ul class="hwlist">
							{state.hw_manager.hws_future
								.sort((a, b)=>Math.sign(a.expire - b.expire))
								.map((hw) => (
									<li><HwCardTiny hw={hw} /></li>
								))}
						</ul>
					);
				}else if(tstate.current_scope === "hws_expired"){
					return (
						<ul class="hwlist">
							{state.hw_manager.hws_expired
								.sort((a, b)=>Math.sign(b.expire - a.expire))
								.map((hw) => (
									<li><HwCardTiny hw={hw} /></li>
								))}
						</ul>
					);
				}
			})()}
			<div class="addbtn" onclick={onAddButtonClick}></div>
		</div>
	);
};
