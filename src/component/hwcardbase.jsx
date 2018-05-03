import {h} from "hyperapp";

import {
	getRelativeDateState,
	getRelativeDateState_markcolor,
	getAbsoluteDateState,
} from "util/dateparser";

export default ({hw, onclick}, children) => (state, actions) => (
	<div
		className="hwcard"
		onclick={onclick}
		style={{
			borderColor: getRelativeDateState_markcolor(hw.expire, state.now)
		}
	}>
		<div className="hwcard-exp">
			<p className="exp-rday">
				{getRelativeDateState(hw.expire)}
			</p>
			<p className="exp-aday">
				{()=>getAbsoluteDateState(hw.expire, {addDay: true})}
			</p>
		</div>
		{children}
	</div>
);
