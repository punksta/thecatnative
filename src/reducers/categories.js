// @flow

import type {SingleKittyActions} from "../actions/index";
import type {Category} from "../api/types";

export type State = {
	loading: boolean,
	categories: Array<Category>,
	error: ?string
};

export const defaultState: State = {
	loading: false,
	categories: [],
	error: null
};

export default (
	state: State = defaultState,
	action: SingleKittyActions
): State => {
	switch (action.type) {
		case "CATEGORIES_LOADING":
			return {
				...state,
				loading: true
			};

		case "CATEGORIES_LOADED":
			return {
				...state,
				loading: false,
				categories: action.categories
			};

		case "CATEGORIES_FAILURE":
			return {
				...state,
				loading: false,
				error: action.error
			};

		default:
			return state;
	}
};
