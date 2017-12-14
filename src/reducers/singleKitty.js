// @flow

import type {Kitty} from "../api/types";
import type {SingleKittyActions} from "../actions/index";

export type State = {
	kitty: ?Kitty,
	loading: ?string,
	loadingError: ?string
};

export const defaultState: State = {
	kitty: null,
	loading: null,
	loadingError: null
};

export default (
	state: State = defaultState,
	action: SingleKittyActions
): State => {
	switch (action.type) {
		case "SINGLE_KITTY_REQUEST":
			return {
				...state,
				loadingError: null
			};

		case "SINGLE_KITTY_LOADING":
			return {
				...state,
				loading: action.id
			};

		case "SINGLE_KITTY_LOADING_SUCCESS":
			return {
				...state,
				loading: null,
				kitty: action.kitty
			};

		case "SINGLE_KITTY_LOADING_ERROR":
			return {
				...state,
				loading: null,
				loadingError: action.error
			};

		default:
			return state;
	}
};
