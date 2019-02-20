// @flow

import type {Category, Kitty} from "../api/types";
import type {NavigationAction} from "react-navigation";
import type {ListSettings} from "../reducers/kittyList";

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
	  }
	| {
			type: "KITTY_LIST_SETTINGS_CHANGED",
			settings: ListSettings
	  };

export type DeepLinkActions = {
	type: "KITTY_DEEP_LINK_MEOW",
	kittyId: string
};

export type SingleKittyActions =
	| {
			type: "SINGLE_KITTY_REQUEST",
			id?: string
	  }
	| {
			type: "SINGLE_KITTY_LOADING",
			id?: string
	  }
	| {
			type: "SINGLE_KITTY_LOADING_SUCCESS",
			kitty: Kitty
	  }
	| {
			type: "SINGLE_KITTY_LOADING_ERROR",
			error: string
	  };

export type CategoriesActions =
	| {
			type: "CATEGORIES_REQUEST"
	  }
	| {
			type: "CATEGORIES_LOADING"
	  }
	| {
			type: "CATEGORIES_LOADED",
			categories: Array<Category>
	  }
	| {
			type: "CATEGORIES_FAILURE",
			error: string
	  };

export type Action =
	| NavigationAction
	| KittyListActions
	| DeepLinkActions
	| SingleKittyActions
	| CategoriesActions;
