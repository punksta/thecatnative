// @flow

import type {Kitty} from "../api/types";
import {List, Set} from "immutable";
import type {KittyListActions} from "../actions";

type State = {
	data: List<Kitty>,
	ids: Set<string>,
	loadingState: "refreshing" | "loading" | "idle",
	meeeooow: ?string
}

const initialState: State = {
	data: List(),
	ids: Set(),
	loadingState: 'idle',
	meeeooow: null
};

export default (state: State = initialState, action: KittyListActions): State => {
	switch (action.type) {
		case 'KITTY_LIST_REQUEST' :
			return {...state, meeeooow: null};

		case 'KITTY_LIST_LOADING':
			return {...state, loadingState: action.refresh ? 'refreshing' : 'loading'};

		case 'KITTY_LIST_SUCCESS':
			if (action.refresh) {
				return {
					loadingState: 'idle',
					data: List(action.data),
					ids: Set(action.data.map(item => item.id)),
					meeeooow: null,
				}
			} else {
				const itemsToAdd = action.data.filter(item => !state.ids.has(item.id));
				return {
					loadingState: 'idle',
					data: state.data.concat(itemsToAdd),
					ids: state.ids.merge(itemsToAdd.map(item => item.id)),
					meeeooow: null
				}
			}
		case 'KITTY_LIST_FAILURE':
			return {
				...state,
				loadingState: 'idle',
				meeeooow: action.meeeooow
			};
		default:
			return state;
	}
}
