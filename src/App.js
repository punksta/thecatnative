/**
 * @flow
 */

import React, {Component} from "react";
import {AppNavigator} from "./navigation/AppNavigator";

import type {
	NavigationDispatch,
	NavigationEventCallback,
	NavigationEventPayload,
	NavigationState
} from "react-navigation";
import {addNavigationHelpers} from "react-navigation";
import {View} from "react-native";
import {connect, Provider} from "react-redux";
import BackgroundImage from "./components/BackgroundImage";
import configureStore from "./configureStore";
import {
	createReduxBoundAddListener,
	createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

type Props = {
	dispatch: NavigationDispatch,
	nav: NavigationState
};

const navigationMiddleware = createReactNavigationReduxMiddleware(
	"root",
	state => state.nav
);
const addListener = createReduxBoundAddListener("root");

const App = props => (
	<AppNavigator
		navigation={addNavigationHelpers({
			dispatch: props.dispatch,
			state: props.nav,
			addListener
		})}
	/>
);

const mapStateToProps = state => ({
	nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = configureStore(navigationMiddleware);

export const Root = props => (
	<View style={{flex: 1}}>
		<BackgroundImage />
		<Provider
			style={{
				flex: 1
			}}
			store={store}
		>
			<AppWithNavigationState />
		</Provider>
	</View>
);

export default Root;
