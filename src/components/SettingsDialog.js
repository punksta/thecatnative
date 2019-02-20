// @flow

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogButton
} from "react-native-popup-dialog";
import {View, TouchableOpacity, StyleSheet, Text} from "react-native";
import React, {Component} from "react";
import type {ListSettings} from "../reducers/kittyList";
import type {State as CategoriesState} from "../reducers/categories";

type Props = {
	settings: ListSettings,
	categories: CategoriesState,
	onSettingsChanged: ListSettings => void
};

type State = {
	visible: boolean,
	selectedItems: Array<number>
};

class SettingsDialog extends Component<Props, State> {
	state = {
		visible: false,
		selectedItems: []
	};

	show = () => {
		this.setState({
			visible: true,
			selectedItems: this.props.settings.selectedCategoryIds
		});
	};

	renderItem = (isSelected: boolean, title: string, onPress: () => void) => {
		return (
			<TouchableOpacity onPress={onPress} key={title}>
				<Text style={isSelected ? styles.selectedItem : styles.item}>
					{title}
				</Text>
			</TouchableOpacity>
		);
	};

	onItemTouched = c => {
		this.setState(s => {
			const hasItem = s.selectedItems.includes(c.id);
			if (hasItem) {
				return {
					selectedItems: []
				};
			} else {
				return {
					selectedItems: [c.id]
				};
			}
		});
	};

	onPressOk = () => {
		this.setState({
			visible: false
		});

		if (
			JSON.stringify(this.state.selectedItems) !==
			JSON.stringify(this.props.selectedCategoryIds)
		) {
			this.props.onSettingsChanged({
				...this.props.settings,
				selectedCategoryIds: this.state.selectedItems
			});
		}
	};

	onPressCancel = () => {
		this.setState({
			visible: false
		});
	};

	render() {
		return (
			<Dialog
				visible={this.state.visible}
				dialogTitle={<DialogTitle title="Select categories" />}
				footer={
					<DialogFooter>
						<DialogButton text="Ok" onPress={this.onPressOk} />
						<DialogButton text="Cancel" onPress={this.onPressCancel} />
					</DialogFooter>
				}
			>
				<DialogContent>
					<View>
						{this.props.categories.categories.map(c => {
							const hasItem = this.state.selectedItems.includes(c.id);
							return this.renderItem(
								hasItem,
								c.name,
								this.onItemTouched.bind(null, c)
							);
						})}
					</View>
				</DialogContent>
			</Dialog>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		fontSize: 18,
		margin: 4
	},
	selectedItem: {
		color: "#111",
		fontSize: 18,
		fontWeight: "bold",
		margin: 4
	}
});

export default SettingsDialog;
