import {
	loadKittiesToList,
	refreshListOnSettingsChange,
	sendEvent
} from "./kittyList";
import {combineEpics} from "redux-observable";
import {loadSingleKitty} from "./singleKitty";
import {deepLinking} from "./deepLinking";
import {loadCategories} from "./categories";

export default combineEpics(
	loadKittiesToList,
	refreshListOnSettingsChange,
	loadSingleKitty,
	deepLinking,
	loadCategories,
	sendEvent
);
