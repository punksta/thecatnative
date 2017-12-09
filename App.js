/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppNavigator} from "./src/navigation/AppNavigator";

import type {NavigationDispatch} from "react-navigation"

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
	kittyList
});

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from "./src/epics"

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
	appReducer,
	applyMiddleware(logger),
	applyMiddleware(epicMiddleware)

);

export default class Root extends React.Component<{}> {
	render() {
		return (
			<Provider store={store}>
				<AppWithNavigationState />
			</Provider>
		);
	}
}