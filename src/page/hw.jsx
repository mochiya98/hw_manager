import {h} from "hyperapp";
import HwCardFull from "component/hwcardfull";

export default ({match}) => (state, actions) => (
	<HwCardFull hw={state.hw_manager.hws[match.params.hw_id]} />
);
