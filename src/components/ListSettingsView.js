// @flow

import * as React from "react";
import {Switch, Text, View} from "react-native";
import type {ListSettings} from "../reducers/kittyList";
import {pure} from "recompose";

type Props = {
	settings: ListSettings,
	onSettingsChanged: ListSettings => void
};

const ListSettingsView = (props: Props) => {
	return (
		<View
			style={{
				margin: 16
			}}
		>
			<View
				style={{
					flexDirection: "row"
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold"
					}}
				>
					GIF
				</Text>
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

const component: React.ComponentType<Props> = pure(ListSettingsView);

export default component;
