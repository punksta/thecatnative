// @flow
import * as React from "react";
import type {NavigationState, NavigationRoute} from "react-navigation";

type Route = NavigationRoute;

const getCurrentRoute = (state: NavigationState | Route): Route => {
	if (state.routes && typeof state.index === "number") {
		// $FlowFixMe
		return getCurrentRoute(state.routes[state.index]);
	}
	// $FlowFixMe
	return state;
};

export function withCurrentRoute<
	PropsInput: {},
	S: NavigationState,
	PropsOutput: {}
>(
	getNavigationState: PropsInput => S,
	mapperFn: (PropsInput, ?Route) => PropsOutput
): (React.ComponentType<PropsOutput>) => React.ComponentType<PropsInput> {
	return Component => (props: PropsInput) => {
		const currentState: S = getNavigationState(props);
		const currentRoute: ?Route = getCurrentRoute(currentState);
		const outPutProps: PropsOutput = mapperFn(props, currentRoute);
		return <Component {...outPutProps} />;
	};
}
