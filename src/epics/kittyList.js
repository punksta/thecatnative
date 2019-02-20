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
import {trackEvent} from "../events";

const PRE_PAGE = 40;

export const loadKittiesToList = (
	actions: Observable<Action>,
	store: *
): Observable<Action> => {
	const state = () => store.getState().kittyList;

	return actions
		.filter((a: Action) => {
			switch (a.type) {
				case "KITTY_LIST_REQUEST":
					return (
						a.refresh ||
						(state().loadingState === "idle" && state().isLastPage === false)
					);
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
				Api.fetchKitties({
					count: 40,
					type: state().settings.type,
					category_ids: state().settings.selectedCategoryIds
				})
			)
				.map(data => ({
					type: "KITTY_LIST_SUCCESS",
					data,
					refresh,
					isLastPage: data.length < PRE_PAGE
				}))
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

export const sendEvent = (
	actions: Observable<Action>,
	store: *
): Observable<Action> =>
	actions.mergeMap(a => {
		switch (a.type) {
			case "KITTY_LIST_SETTINGS_CHANGED": {
				const categoryId = a.settings.selectedCategoryIds[0];
				let data = {type: a.settings.type};

				if (categoryId !== undefined) {
					data = {
						...data,
						categoryId,
						categoryName: (
							store
								.getState()
								.categories.categories.find(r => r.id === categoryId) || {}
						).name
					};
				}
				trackEvent("SETTINGS_CHANGED", data);
				break;
			}
			default:
		}

		return Observable.empty();
	});
