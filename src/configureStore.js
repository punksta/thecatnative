// @flow

import logger from "redux-logger";
import {createEpicMiddleware} from "redux-observable";
import {combineReducers, createStore, applyMiddleware} from "redux";

import rootEpic from "./epics/index";
import kittyList from "./reducers/kittyList";
import singleKitty from "./reducers/singleKitty";

import {AppNavigator} from "./navigation/AppNavigator";
import {NavigationActions} from "react-navigation";
import {createNavReducer} from "./reducers/navReducer";
import type {Middleware} from "redux";
import categories from "./reducers/categories";

export default (navigationMiddleware: Middleware) => {
	const epicMiddleware = createEpicMiddleware(rootEpic);

	const middleWares = [epicMiddleware, navigationMiddleware];

	if (__DEV__) {
		middleWares.push(logger);
	}

	const initialState = AppNavigator.router.getStateForAction(
		NavigationActions.init()
	);

	const appReducer = combineReducers({
		nav: createNavReducer(initialState, AppNavigator),
		kittyList,
		singleKitty,
		categories
	});

	return createStore(appReducer, applyMiddleware(...middleWares));
};
