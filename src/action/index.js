import {location} from "hyperapp-hash-router";

import page from "./page";

import hw_manager from "./hw_manager";

export default {
	location: location.actions,
	page,
	hw_manager,
};
