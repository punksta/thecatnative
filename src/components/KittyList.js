// @flow
import * as React from "react"
import {VirtualizedList, StyleSheet, Image, View, ActivityIndicator} from "react-native"

import {KittyImage} from "./KittyImage"
import {List} from "immutable"
import type {Kitty} from "../api/types";
import KittyLoader from "./KittyLoader";

type Props = {
	kitties: List<Kitty>,
	listStyle: *,
	kittyStyle: *,
	kittyStyle2: *,
	loading?: boolean,
	refreshing?: boolean,
	onRefresh?: () => void,
	onEndReached?:() => void
}

export default class KittyList extends React.Component<Props> {

	getItemList = (data: List<*>, index: number) => {
		return data.get(index);
	};

	getItemCountList = (data: List<*>) => {
		return data.size;
	};

	getTableStyle = (index: number) => {
		const cellNumber = Math.round((index + 1) / 2);
		const cellNumberIsOdd = (cellNumber % 2 === 1);
		const itemIsOdd = (index + 1) % 2 === 1;

		return (itemIsOdd !== cellNumberIsOdd) ? this.props.kittyStyle : this.props.kittyStyle2
	}

	getListStyle = (index: number) => {
		const itemIsOdd = (index + 1) % 2 === 1;
		return (itemIsOdd) ? this.props.kittyStyle : this.props.kittyStyle2
	}

	renderItem = (info: { item: Kitty, index: number }) => {
		return	(
			<KittyImage
				url={info.item.url}
				style={this.getListStyle(info.index)}
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
					style={{flex:0.3}}
				/>
				<KittyLoader/>

			</View>
		);
	};

	render() {
		return (
			<VirtualizedList
				refreshing={this.props.refreshing}
				onRefresh={this.props.onRefresh}
				initialNumToRender={10}
				horizontal={false}
				style={this.props.listStyle}
				data={this.props.kitties}
				getItem={this.getItemList}
				getItemCount={this.getItemCountList}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ListFooterComponent={this.renderFooter}
				onEndReachedThreshold={0.7}
				onEndReached={this.props.onEndReached}
			/>
		)
	}
}
