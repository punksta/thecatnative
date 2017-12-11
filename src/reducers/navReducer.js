// @flow

export const createNavReducer = (initialState: *, navigator: *) => {
	return (state: * = initialState, action: *) => {
		const newState = navigator.router.getStateForAction(action, state);
		return newState || state;
	};
};
