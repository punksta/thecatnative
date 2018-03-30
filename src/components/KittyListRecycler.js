// @flow
import * as React from "react";
import {
	Dimensions,
	StyleSheet,
	View,
	ActivityIndicator,
	RefreshControl
} from "react-native";

import {KittyImage} from "./KittyImage";
import {List, is} from "immutable";
import type {Kitty} from "../api/types";
import KittyLoader from "./KittyLoader";
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";

interface Header {
	data: any;
}

class KittyDataProvider extends DataProvider {
	_list: List<Kitty>;
	_header: Header;
	_firstIndexToProcess: number;

	constructor(list: List<Kitty>, headerData: ?any) {
		super((a1, a2) => {
			if (a1.data || a2.data) {
				return !is(a1.data, a2.data);
			}
			return !is(a1.id, a2.id);
		});

		this._header = {
			data: headerData
		};

		this._firstIndexToProcess = 0;
		this._list = list;
	}

	getDataForIndex(index: number): any {
		return index === 0 ? this._header : this._list.get(index - 1);
	}

	static getAllData(): any[] {
		return [];
	}

	getFirstIndexToProcessInternal() {
		return this._firstIndexToProcess;
	}

	getSize(): number {
		return this._list.size + 1;
	}

	clone(list: List<Kitty>, headerData: ?any): KittyDataProvider {
		const dp = new KittyDataProvider(list, headerData);
		const iterCount = Math.min(this.getSize(), dp.getSize());

		let i = 0;
		for (i = 0; i < iterCount; i++) {
			if (this.rowHasChanged(this.getDataForIndex(i), dp.getDataForIndex(i))) {
				break;
			}
		}
		dp._firstIndexToProcess = i;
		return dp;
	}
}

const ViewTypes = {
	HeaderItem: 0,
	OddItem: 1,
	NotOddItem: 2
};

const layoutProvider = new LayoutProvider(
	index => {
		if (index === 0) {
			return ViewTypes.HeaderItem;
		}
		const itemIsOdd = (index + 1) % 2 === 1;
		if (itemIsOdd) {
			return ViewTypes.OddItem;
		}
		return ViewTypes.NotOddItem;
	},
	(type, dim) => {
		switch (type) {
			case ViewTypes.HeaderItem:
				dim.width = Dimensions.get("window").width;
				dim.height = 50;
				return;

			default:
				dim.width = Dimensions.get("window").width;
				dim.height = Dimensions.get("window").width;
		}
	}
);

export interface ScrollEvent {
	nativeEvent: {
		contentOffset: {
			x: number,
			y: number
		}
	};
}

type Props = {
	kitties: List<Kitty>,
	listStyle: *,
	kittyStyle: *,
	kittyStyle2: *,
	loading?: boolean,
	refreshing?: boolean,
	onRefresh?: () => void,
	onEndReached: () => void,
	headerData: ?any,
	renderHeader?: any => {},
	onKittyLikePress?: Kitty => void,
	onKittyUnLikePress?: Kitty => void,
	onKittySharePress?: Kitty => void,
	onScroll?: (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => void
};

type State = {
	dataProvider: KittyDataProvider
};

export default class KittyList extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			dataProvider: new KittyDataProvider(props.kitties, props.headerData)
		};
	}

	getItemList = (data: List<*>, index: number) => data.get(index);

	getItemCountList = (data: List<*>) => data.size;

	scrollToTop = (animate: boolean) => {
		this.refs.list && this.refs.list.scrollToTop(animate);
	};

	// Given type and data return the view component
	_rowRenderer = (type, item: Kitty | Header<*>) => {
		// You can return any view here, CellContainer has no special significance
		switch (type) {
			case ViewTypes.HeaderItem:
				// $FlowFixMe
				return this.props.renderHeader((item: Header).data);
			case ViewTypes.OddItem:
				// $FlowFixMe
				return this.renderItem((item: Kitty), this.props.kittyStyle);
			case ViewTypes.NotOddItem:
				// $FlowFixMe
				return this.renderItem((item: Kitty), this.props.kittyStyle2);
			default:
				return null;
		}
	};

	componentWillReceiveProps(props: Props) {
		if (
			!is(this.props.kitties, props.kitties) ||
			!is(this.props.headerData, props.headerData)
		) {
			this.setState({
				dataProvider: this.state.dataProvider.clone(
					props.kitties,
					props.headerData
				)
			});
		}
	}

	renderItem = (item: Kitty, style: *) => {
		const buttonProps = {
			onShareClick: () =>
				this.props.onKittySharePress && this.props.onKittySharePress(item),
			onLikeClick: () =>
				this.props.onKittyLikePress && this.props.onKittyLikePress(item),
			onDislikeClick: () =>
				this.props.onKittyUnLikePress && this.props.onKittyUnLikePress(item)
		};

		return (
			<KittyImage url={item.url} style={style} buttonsProps={buttonProps} />
		);
	};

	keyExtractor = (item: Kitty) => item.id;

	renderFooter = () => {
		if (!this.props.loading) return null;

		return (
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					paddingVertical: 25,
					flexDirection: "row"
				}}
			>
				<KittyLoader size={75} />
				<View style={{flex: 1 / 3}} />
				<KittyLoader size={75} />
			</View>
		);
	};

	refreshControl = () => (
		<RefreshControl
			refreshing={this.props.refreshing || false}
			onRefresh={this.props.onRefresh}
		/>
	);

	render() {
		return (
			<RecyclerListView
				ref="list"
				refreshControl={this.refreshControl()}
				layoutProvider={layoutProvider}
				dataProvider={this.state.dataProvider}
				rowRenderer={this._rowRenderer}
				horizontal={false}
				style={this.props.listStyle}
				keyExtractor={this.keyExtractor}
				renderFooter={this.renderFooter}
				onScroll={this.props.onScroll}
				onEndReachedThreshold={0.7}
				onEndReached={this.props.onEndReached}
			/>
		);
	}
}
