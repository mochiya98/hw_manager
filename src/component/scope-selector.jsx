import {h} from "hyperapp";

export default ({scopes, onchange, current, sid, ...args}, children) => (state, actions) => {
	if(!sid){
		sid = Math.random().toString(36).slice(2);
	}
	let elForm;
	function initElForm(el){
		elForm = el;
	}
	function onScopeChange(){
		const selected_scope = elForm.scope.value;
		if(onchange) onchange(selected_scope);
	}
	let inputid_count = 0;
	return (
		<form oncreate={initElForm} onupdate={initElForm}>
			<ul class="scope_bar">
				{scopes.map(({id, label})=>(
					<li>
						<input
							type="radio"
							name="scope"
							id={sid + ++inputid_count}
							checked={current === id}
							value={id}
							onchange={onScopeChange}
						/>
						<label for={sid + inputid_count}>{label}</label>
					</li>
				))}
			</ul>
		</form>
	);
};
