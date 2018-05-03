import {h} from "hyperapp";
import HwCardEdit from "component/hwcardedit";

export default ({match}) => (state, actions) => (
	<HwCardEdit hwid={match.params.hw_id} hw={state.hw_manager.hws[match.params.hw_id]} />
);
