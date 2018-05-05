import {h} from "hyperapp";
import classNames from "classnames";

export default ({loading, disabled, stretch, className, ...args}, children) => (state, actions) => (
	<button
		className={classNames(
			"hwcard-btn",
			{
				"hwcard-btn--loading": loading,
				"hwcard-btn--stretch": stretch,
			},
			className
		)}
		disabled={disabled || loading}
		onclick={()=>history.back()}
		{...args}
	>
		{children}
	</button>
);
