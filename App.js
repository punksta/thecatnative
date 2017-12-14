/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppNavigator} from "./src/navigation/AppNavigator";

import type {NavigationDispatch} from "react-navigation"
import {Image, View, Dimensions, Linking} from "react-native"
import {addNavigationHelpers, NavigationActions} from 'react-navigation';
import {combineReducers, createStore, applyMiddleware} from "redux";
import {createNavReducer} from "./src/reducers/navReducer";
import {connect, Provider} from "react-redux";

import logger from 'redux-logger'
import kittyList from "./src/reducers/kittyList";


const mapStateToProps = (state) => ({
	nav: state.nav,
});


type Props =  {
	dispatch: NavigationDispatch,
	nav: *
}

class App extends Component<Props> {
	render() {
		return (
			<AppNavigator navigation={addNavigationHelpers({
				dispatch: this.props.dispatch,
				state: this.props.nav,
			})} />
		);
	}
}

const AppWithNavigationState = connect(mapStateToProps)(App);

const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

const appReducer = combineReducers({
	nav: createNavReducer(initialState, AppNavigator),
	kittyList,
	singleKitty
});

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from "./src/epics"
import BackgroundImage from "./src/components/BackgroundImage";
import singleKitty from "./src/reducers/singleKitty";

const epicMiddleware = createEpicMiddleware(rootEpic);

const middleWares = [epicMiddleware];
if (__DEV__) {
	middleWares.push(logger)
}
const store = createStore(
	appReducer,
	applyMiddleware(...middleWares),
);

export default class Root extends React.Component<{}> {

	componentDidMount() {
		Linking.getInitialURL().then((url) => {
			if (url) {
				console.log('Initial url is: ' + url);
			}
		}).catch(err => console.error('An error occurred', err));
	}

	render() {
		return (
			<View
				style={{flex:1}}
			>
				<BackgroundImage/>

				<Provider
				style={{
					flex:1
				}}
					store={store}>
					<AppWithNavigationState />
				</Provider>
			</View>
		);
	}
}

