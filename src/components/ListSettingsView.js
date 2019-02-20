// @flow

import * as React from "react";
import {Switch, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import type {ListSettings} from "../reducers/kittyList";
import {compose, pure, withState} from "recompose";
import type {State as CategoriesState} from "../reducers/categories";
import type {Category} from "../api/types";

type Props = {
	settings: ListSettings,
	categories: CategoriesState,
	onSettingsChanged: ListSettings => void,
	rootViewStyle: *,
	showSettingsDialog: () => void
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const SelectedCategories = ({selectedCategoryIds, categories}) => {
	if (selectedCategoryIds.length === 0) {
		return <Text style={styles.categories}>Categories: all</Text>;
	} else if (selectedCategoryIds.length === 1) {
		return (
			<Text style={styles.categories}>
				{capitalizeFirstLetter(
					categories.find(c => c.id === selectedCategoryIds[0]).name
				)}
			</Text>
		);
	}
	return (
		<Text style={styles.categories} numberOfLines={1} ellipsizeMode="tail">
			Categories:{" "}
			{categories
				.filter(c => selectedCategoryIds.includes(c.id))
				.map(r => r.name)
				.join(", ")}
		</Text>
	);
};

const ListSettingsView = (props: Props) => (
	<View style={props.rootViewStyle}>
		<View style={styles.row}>
			<Text style={styles.text}>GIF</Text>
			<Switch
				onValueChange={isSelected => {
					const type = isSelected ? "gif" : "img";
					if (type !== props.settings.type) {
						props.onSettingsChanged({
							...props.settings,
							type
						});
					}
				}}
				value={props.settings.type === "gif"}
			/>

			<TouchableOpacity
				onPress={() => {
					props.showSettingsDialog();
				}}
			>
				<SelectedCategories
					categories={props.categories.categories}
					selectedCategoryIds={props.settings.selectedCategoryIds}
				/>
			</TouchableOpacity>
		</View>
	</View>
);

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "center"
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#111"
	},
	categories: {
		fontWeight: "bold",
		marginHorizontal: 16,
		color: "#111",
		fontSize: 20,
		maxWidth: 200
	}
});
const component: React.ComponentType<Props> = compose(pure)(ListSettingsView);

export default component;
