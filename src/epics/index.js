import {loadKittiesToList, refreshListOnSettingsChange} from "./kittyList";
import {combineEpics} from "redux-observable";
import {loadSingleKitty} from "./singleKitty";

export default combineEpics(
	loadKittiesToList,
	refreshListOnSettingsChange,
	loadSingleKitty
);
