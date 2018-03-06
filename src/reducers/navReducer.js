// @flow

import {NavigationActions} from "react-navigation";

export const createNavReducer = (initialState: *, navigator: *) => (
	state: * = initialState,
	action: *
) => {
	switch (action.type) {
		case "KITTY_DEEP_LINK_MEOW":
			return navigator.router.getStateForAction(
				NavigationActions.navigate({routeName: "SingleKitty"}),
				state
			);
		default:
			const newState = navigator.router.getStateForAction(action, state);
			return newState || state;
	}
};
