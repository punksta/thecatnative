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

export const loadCategories = (
	actions: Observable<Action>,
	store: *
): Observable<Action> =>
	actions
		.filter(action => {
			switch (action.type) {
				case "CATEGORIES_REQUEST":
					return true;
				default:
					return false;
			}
		})
		.switchMap(() => {
			const loadingAction = Observable.of({
				type: "CATEGORIES_LOADING"
			});

			const requestObservable = Observable.of(1)
				.delay(200)
				.mergeMap(_ => {
					const request = Api.getCategories();

					return asObservable(request)
						.map(categories => ({type: "CATEGORIES_LOADED", categories}))
						.catch(e =>
							Observable.of({
								type: "CATEGORIES_FAILURE",
								error: e.toString()
							})
						);
				});

			return Observable.concat(loadingAction, requestObservable);
		});
