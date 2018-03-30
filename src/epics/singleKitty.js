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
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/delay";

import type {State as SingleKittyState} from "../reducers/singleKitty";

export const loadSingleKitty = (
	actions: Observable<Action>,
	store: *
): Observable<Action> =>
	actions
		.filter(action => {
			switch (action.type) {
				case "SINGLE_KITTY_REQUEST":
					return true;
				default:
					return false;
			}
		})
		.switchMap(({id}) => {
			const loadingAction = Observable.of({
				type: "SINGLE_KITTY_LOADING",
				id
			});

			const requestObservable = Observable.of(1)
				.delay(200)
				.mergeMap(_ => {
					const request =
						id !== undefined
							? Api.fetchKitty(id)
							: Api.fetchRandomKitty({type: "gif"});

					return asObservable(request)
						.map(kitty => ({type: "SINGLE_KITTY_LOADING_SUCCESS", kitty}))
						.catch(e =>
							Observable.of({
								type: "SINGLE_KITTY_LOADING_ERROR",
								error: e.toString()
							})
						);
				});

			return Observable.concat(loadingAction, requestObservable);
		});
