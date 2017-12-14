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
	try {
		const urlParsed = urlParse(url, true);
		if (urlParsed) {
			if (urlParsed["hostname"] !== "thecatapi.com") {
				return undefined;
			} else {
				const query = urlParsed.query["id"];
				if (typeof query !== "string") {
					return undefined;
				} else {
					return query;
				}
			}
		}
	} catch (e) {
		return undefined;
	}
};

export const getDeepLinkObservable = () => {
	return Observable.create(observer => {
		const listener = ({url}) => {
			observer.next(url);
		};
		Linking.addEventListener("url", listener);
		return () => {
			Linking.removeEventListener("url", listener);
		};
	});
};

const getDeepLinkIds = () => {
	return fromPromiseIgnoreErrors(Linking.getInitialURL())
		.concat(getDeepLinkObservable())
		.map(urlToKittyId)
		.filter(id => typeof id === "string")

};

let called = false;

export const deepLinking = (
	actions: Observable<Action>,
	store: *
): Observable<Action> => {
	if (called) {
		return Observable.empty();
	}
	called = true;
	return getDeepLinkIds().mergeMap(kittyId => {
		return Observable.concat(
			Observable.of({
				type: "SINGLE_KITTY_REQUEST",
				id: kittyId
			}),
			Observable.of({
				type: "KITTY_DEEP_LINK_MEOW",
				kittyId
			})
		);
	});
};
