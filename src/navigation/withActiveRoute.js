// @flow
import * as React from "react";
import {withCurrentRoute} from "./withCurrentRoute";
import type {NavigationProp} from "react-navigation";

type isActiveProps<P> = P & {isActive: boolean};

/**
 * hoc which adds isActive to props of given component
 * https://github.com/react-community/react-navigation/issues/51
 * @param Component
 * @return {*}
 */
export default function<Props: {nav: *, navigation: NavigationProp<*>}>(
	Component: React.ComponentType<isActiveProps<Props>>
): React.ComponentType<Props> {
	const hoc = withCurrentRoute(
		(p: Props) => p.nav,
		(p: Props, route: *) => {
			const isActive: boolean = p.navigation.state.key === (route || {}).key;
			return {
				...p,
				isActive
			};
		}
	);
	return hoc(Component);
}
