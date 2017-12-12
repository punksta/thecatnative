// @flow

import * as React from "react";
import {Switch, Text, View, StyleSheet} from "react-native";
import type {ListSettings} from "../reducers/kittyList";
import {pure} from "recompose";

type Props = {
	settings: ListSettings,
	onSettingsChanged: ListSettings => void,
	rootViewStyle: *
};

const ListSettingsView = (props: Props) => {
	return (
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
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "center"
	},
	text: {
		fontSize: 20,
		fontWeight: "bold"
	}
});
const component: React.ComponentType<Props> = pure(ListSettingsView);

export default component;
