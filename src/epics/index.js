import {loadKittiesToList, refreshListOnSettingsChange} from "./kittyList";
import {combineEpics} from "redux-observable";
import {loadSingleKitty} from "./singleKitty";
import {deepLinking} from "./deepLinking";

export default combineEpics(
	loadKittiesToList,
	refreshListOnSettingsChange,
	loadSingleKitty,
	deepLinking
);
