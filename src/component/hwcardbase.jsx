import {h} from "hyperapp";

import {
	getRelativeDateState,
	getRelativeDateState_markcolor,
	getAbsoluteDateState,
} from "util/dateparser";

export default ({hw, ...args}, children) => ($state, $actions) => (
	<div
		className="hwcard"
		style={{
			borderColor: getRelativeDateState_markcolor(hw.expire, $state.now),
		}}
		{...args}
	>
		<div className="hwcard-exp">
			<p className="exp-rday" data-test="hwcardbase-exp-rday">
				{getRelativeDateState(hw.expire)}
			</p>
			<p className="exp-aday" data-test="hwcardbase-exp-aday">
				{()=>getAbsoluteDateState(hw.expire, {addDay: true})}
			</p>
		</div>
		{children}
	</div>
);
