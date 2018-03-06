/**
 * @flow
 */

import React, {Component} from "react";
import {AppNavigator} from "./navigation/AppNavigator";

import type {NavigationDispatch} from "react-navigation";
import {addNavigationHelpers} from "react-navigation";
import {View} from "react-native";
import {connect, Provider} from "react-redux";
import BackgroundImage from "./components/BackgroundImage";
import configureStore from "./configureStore";
import {
	createReduxBoundAddListener,
	createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

import type {
	NavigationEventCallback,
	NavigationEventPayload,
	NavigationState
} from "react-navigation";

type Props = {
	dispatch: NavigationDispatch,
	nav: NavigationState
};

const navigationMiddleware = createReactNavigationReduxMiddleware(
	"root",
	state => state.nav
);
const addListener = createReduxBoundAddListener("root");

class App extends Component<Props> {
	render() {
		return (
			<AppNavigator
				navigation={addNavigationHelpers({
					dispatch: this.props.dispatch,
					state: this.props.nav,
					addListener
				})}
			/>
		);
	}
}

const mapStateToProps = state => ({
	nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = configureStore(navigationMiddleware);

export default class Root extends React.Component<{}> {
	render() {
		return (
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
	}
}
