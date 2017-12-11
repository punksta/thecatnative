// @flow

import type {Kitty} from "../api/types";
import type {NavigationAction} from "react-navigation";

export type KittyListActions =
	| {
			type: "KITTY_LIST_REQUEST",
			refresh: boolean
		}
	| {
			type: "KITTY_LIST_LOADING",
			refresh: boolean
		}
	| {
			type: "KITTY_LIST_SUCCESS",
			refresh: boolean,
			data: Array<Kitty>
		}
	| {
			type: "KITTY_LIST_FAILURE",
			refresh: boolean,
			meeeooow: string
		};

export type Action = NavigationAction | KittyListActions;
