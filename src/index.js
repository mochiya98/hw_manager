import {app} from "hyperapp";
import {location} from "hyperapp-hash-router";

import "./index.css";

import state from "state";
import action from "action";
import view from "view";

document.body.textContent = "";

const wiredActions = app(state, action, view, document.body);
// eslint-disable-next-line no-unused-vars
const unsubscribe = location.subscribe(wiredActions.location);

wiredActions.hw_manager.init();
