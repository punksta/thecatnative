import {loadKittiesToList} from "./kittyList";
import {combineEpics} from "redux-observable";

export default combineEpics(loadKittiesToList);
