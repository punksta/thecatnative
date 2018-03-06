// @flow
import type {Action} from "../actions";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/concat";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/concat";

import {Linking} from "react-native";
import {fromPromiseIgnoreErrors} from "./rxUtils";

const urlParse = require("url-parse");

const urlToKittyId: string => ?string = url => {
	let result;
	try {
		const urlParsed = urlParse(url, true);
		if (urlParsed) {
			if (urlParsed.hostname === "thecatapi.com") {
				const query = urlParsed.query.id;
				if (typeof query === "string") {
					result = query;
				}
			}
		}
	} catch (e) {
		// ignore
	}
	return result;
};

export const getDeepLinkObservable = () =>
	Observable.create(observer => {
		const listener = ({url}) => {
			observer.next(url);
		};
		Linking.addEventListener("url", listener);
		return () => {
			Linking.removeEventListener("url", listener);
		};
	});

const getDeepLinkIds = () =>
	fromPromiseIgnoreErrors(Linking.getInitialURL())
		.concat(getDeepLinkObservable())
		.map(urlToKittyId)
		.filter(id => typeof id === "string");

let called = false;

export const deepLinking = (
	actions: Observable<Action>,
	store: *
): Observable<Action> => {
	if (called) {
		return Observable.empty();
	}
	called = true;
	return getDeepLinkIds().mergeMap(kittyId =>
		Observable.concat(
			Observable.of({
				type: "SINGLE_KITTY_REQUEST",
				id: kittyId
			}),
			Observable.of({
				type: "KITTY_DEEP_LINK_MEOW",
				kittyId
			})
		)
	);
};
