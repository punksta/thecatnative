// @flow
import {asObservable} from "./rxUtils";
import {Observable} from "rxjs/Observable";
import type {Action} from "../actions";
import Api from "../api";
import "rxjs/add/observable/of";
import "rxjs/add/observable/concat";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/debounceTime";

import type {State as SingleKittyState} from "../reducers/singleKitty";

export const loadSingleKitty = (
	actions: Observable<Action>,
	store: *
): Observable<Action> => {
	const state: () => SingleKittyState = () => store.getState().singleKitty;

	return actions
		.filter(action => {
			switch (action.type) {
				case "SINGLE_KITTY_REQUEST":
					return true;
				default:
					return false;
			}
		})
		.mergeMap(a => {
			const {id} = a;

			const loadingAction = Observable.of({
				type: "SINGLE_KITTY_LOADING",
				id
			});

			const request = id
				? Api.fetchKitty_(id)
				: Api.fetchRandomKitty_({type: "gif"});

			const requestObservable = asObservable(request)
				.map(kitty => ({type: "SINGLE_KITTY_LOADING_SUCCESS", kitty}))
				.catch(e =>
					Observable.of({
						type: "SINGLE_KITTY_LOADING_ERROR",
						error: e.toString()
					})
				);

			return Observable.concat(loadingAction, requestObservable).takeUntil(
				actions.filter(({type}) => type === "SINGLE_KITTY_REQUEST")
			);
		});
};
