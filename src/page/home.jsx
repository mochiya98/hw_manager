import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import HwCardTiny from "component/hwcardtiny";
import generateUuid from "util/generateuuid";
import ScopeSelector from "component/scope-selector";

export default () => ($state, $actions) => {
	const state = $state.page.home;
	const actions = $actions.page.home;
	function onScopeChange(selected_scope){
		if(DEBUG) console.log(`onScopeChange: ${selected_scope}`);
		actions.updateCurrentScope(selected_scope);
	}
	function onAddButtonClick(){
		location.actions.go("/hws/" + generateUuid() + "/edit");
	}
	return (
		<div class="page-home" data-test="page-home">
			<ScopeSelector
				current={state.currentScope}
				onchange={onScopeChange}
				sid="hws_type"
				scopes={[
					{
						id   : "hws_future",
						label: "今後の課題",
					},
					{
						id   : "hws_expired",
						label: "期限切れ",
					},
				]}
				data-test="home-ss-hws_type"
			/>
			{(() => {
				if(state.currentScope === "hws_future"){
					return (
						<ul class="hwlist" data-test="home-hwlist">
							{$state.hw_manager.hws_future
								.sort((a, b)=>Math.sign(a.expire - b.expire))
								.map((hw) => (
									<li><HwCardTiny hw={hw} /></li>
								))}
						</ul>
					);
				}else if(state.currentScope === "hws_expired"){
					return (
						<ul class="hwlist" data-test="home-hwlist">
							{$state.hw_manager.hws_expired
								.sort((a, b)=>Math.sign(b.expire - a.expire))
								.map((hw) => (
									<li><HwCardTiny hw={hw} /></li>
								))}
						</ul>
					);
				}
			})()}
			<div
				class="addbtn"
				onclick={onAddButtonClick}
				data-test="home-hw-addbtn"
			>
			</div>
		</div>
	);
};
