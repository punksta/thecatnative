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

export const loadKittiesToList = (
	actions: Observable<Action>,
	store: *
): Observable<Action> => {
	const state = () => store.getState().kittyList;

	return actions
		.filter((a: Action) => {
			switch (a.type) {
				case "KITTY_LIST_REQUEST":
					return a.refresh || state().loadingState === "idle";
				case "Navigation/NAVIGATE":
					return (
						a.routeName === "ListKitty" &&
						state().loadingState === "idle" &&
						state().data.size === 0
					);
				default:
					return false;
			}
		})
		.mergeMap(a => {
			const refresh = a.refresh || false;

			const loadingAction = Observable.of({
				type: "KITTY_LIST_LOADING",
				refresh
			});

			const requestAction = asObservable(
				Api.fetchKitties_({count: 40, type: "gif"})
			)
				.map(data => ({type: "KITTY_LIST_SUCCESS", data, refresh}))
				.catch(e =>
					Observable.of({
						type: "KITTY_LIST_FAILURE",
						refresh,
						meeeooow: e.toString()
					})
				);

			return Observable.concat(loadingAction, requestAction);
		});
};
