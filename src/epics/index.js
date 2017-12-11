import {loadKittiesToList, refreshListOnSettingsChange} from "./kittyList";
import {combineEpics} from "redux-observable";

export default combineEpics(loadKittiesToList, refreshListOnSettingsChange);
