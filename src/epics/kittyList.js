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
				Api.fetchKitties({count: 40, type: state().settings.type})
			)
				.map(data => ({type: "KITTY_LIST_SUCCESS", data, refresh}))
				.catch(e =>
					Observable.of({
						type: "KITTY_LIST_FAILURE",
						refresh,
						meeeooow: e.toString()
					})
				);

			return Observable.concat(loadingAction, requestAction).takeUntil(
				actions.filter(
					futureAction =>
						(futureAction.type === "KITTY_LIST_REQUEST" &&
							futureAction.refresh) ||
						futureAction.type === "KITTY_LIST_SETTINGS_CHANGED"
				)
			);
		});
};

export const refreshListOnSettingsChange = (
	actions: Observable<Action>,
	store: *
): Observable<Action> =>
	actions
		.ofType("KITTY_LIST_SETTINGS_CHANGED")
		.debounceTime(300)
		.map(a => ({
			type: "KITTY_LIST_REQUEST",
			refresh: true
		}));
