import {h} from "hyperapp";
import {location} from "hyperapp-hash-router";

import HwCardBase from "./hwcardbase";

export default ({hw}) => (state, actions) => (
	<HwCardBase hw={hw} onclick={()=>location.actions.go("/hws/" + hw.id)}>
		<div className="hwcard-tinydesc">
			<div className="s_code">{hw.s_code}</div>
			<h1 className="title">{hw.title}</h1>
		</div>
	</HwCardBase>
);
