import {h} from "hyperapp";
import {Route, Switch} from "hyperapp-hash-router";

import PageHome from "page/home";
import PageHwDetail from "page/hwdetail";
import PageHwEdit from "page/hwedit";

export default (state, actions) => (
	<div id="container">
		<header>
			<h1>HW Manager v.0.1a</h1>
			<div id="notify-popup"></div>
		</header>
		<main>
			{()=>(state.hw_manager.loading
				? <div class="loader"></div>
				: (
					<Switch>
						<Route parent path="/hws/:hw_id/edit" render={PageHwEdit} />
						<Route parent path="/hws/:hw_id" render={PageHwDetail} />
						<Route path="/" render={PageHome} />
					</Switch>
				)
			)}
		</main>
	</div>
);
