// @flow
import * as React from "react"
import {VirtualizedList, Dimensions, StyleSheet, Image, View, ActivityIndicator, RefreshControl} from "react-native"

import {KittyImage} from "./KittyImage"
import {List, is} from "immutable"
import type {Kitty} from "../api/types";
import KittyLoader from "./KittyLoader";
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";


const dataProvider = new DataProvider((r1: Kitty, r2: Kitty) => {
	return r1.id !== r2.id;
});

const layoutProvider = new LayoutProvider(
	index => {
		const itemIsOdd = (index + 1) % 2 === 1;
		if (itemIsOdd) {
			return 0
		} else {
			return 1
		}
	},
	(type, dim) => {
		switch (type) {
			default:
				dim.width = Dimensions.get("window").width;
				dim.height = Dimensions.get("window").width;
		}
	}
);


type Props = {
	kitties: List<Kitty>,
	listStyle: *,
	kittyStyle: *,
	kittyStyle2: *,
	loading?: boolean,
	refreshing?: boolean,
	onRefresh?: () => void,
	onEndReached?: () => void,
	onKittyLikePress?: (Kitty) => void,
	onKittyUnLikePress?: (Kitty) => void,
	onKittySharePress?: (Kitty) => void,
}

type State = {
	dataProvider: DataProvider
}
export default class KittyList extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			dataProvider: dataProvider.cloneWithRows(props.kitties.toArray())
		};
	}

	getItemList = (data: List<*>, index: number) => {
		return data.get(index);
	};

	getItemCountList = (data: List<*>) => {
		return data.size;
	};

	//Given type and data return the view component
	_rowRenderer = (type, item: Kitty) => {
		//You can return any view here, CellContainer has no special significance
		switch (type) {
			case 0:
				return this.renderItem(item, this.props.kittyStyle);
			case 1:
				return this.renderItem(item, this.props.kittyStyle2);
			default:
				return null;
		}
	}

	componentWillReceiveProps(props: Props) {
		if (!is(this.props.kitties, props.kitties)) {
			this.setState({
				dataProvider: this.state.dataProvider.cloneWithRows(props.kitties.toArray())
			})
		}
	}


	renderItem = (item: Kitty, style: *) => {
		const buttonProps = {
			onShareClick: () => this.props.onKittySharePress && this.props.onKittySharePress(item),
			onLikeClick: () => this.props.onKittyLikePress && this.props.onKittyLikePress(item),
			onDislikeClick: () => this.props.onKittyUnLikePress && this.props.onKittyUnLikePress(item)
		};

		return (
			<KittyImage
				url={item.url}
				style={style}
				buttonsProps={buttonProps}
			/>
		)
	};

	keyExtractor = (item: Kitty) => {
		return item.id
	};


	renderFooter = () => {
		if (!this.props.loading) return null;

		return (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingVertical: 25,
					flexDirection: 'row'
				}}
			>
				<KittyLoader/>
				<View
					style={{flex: 1/3}}
				/>
				<KittyLoader/>

			</View>
		);
	};

	refreshControl = () => {
		return (<RefreshControl
			refreshing={this.props.refreshing || false}
			onRefresh={this.props.onRefresh}
		/>)
	}

	render() {

		return (
			<RecyclerListView
				refreshControl={this.refreshControl()}
				layoutProvider={layoutProvider}
				dataProvider={this.state.dataProvider}
				rowRenderer={this._rowRenderer}


				horizontal={false}
				style={this.props.listStyle}

				keyExtractor={this.keyExtractor}
				renderFooter={this.renderFooter}
				onEndReachedThreshold={0.7}
				onEndReached={this.props.onEndReached}
			/>
		)
	}
}
