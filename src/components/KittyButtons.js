// @flow
import * as React from "react";
import {pure} from "recompose";
import {View, Image, TouchableOpacity} from "react-native";

type Props = {
	onShareClick: () => void,
	onLikeClick: () => void,
	onDislikeClick: () => void
};

const disableLikes = true;

const KittyButtons: React.ComponentType<Props> = ({
	onShareClick,
	onLikeClick,
	onDislikeClick
}: Props) => (
	<View
		style={{
			flexDirection: "row"
		}}
	>
		<TouchableOpacity onPress={onShareClick}>
			<Image
				style={{
					margin: 8,
					width: 32,
					height: 32,
					tintColor: "#81a2ff"
				}}
				resizeMode="contain"
				source={require("../assets/img/share_icon.png")}
			/>
		</TouchableOpacity>
		{!disableLikes && (
			<TouchableOpacity onPress={onLikeClick}>
				<Image
					style={{
						margin: 8,
						width: 32,
						height: 32,
						marginHorizontal: 8,
						tintColor: "#ff33aa"
					}}
					resizeMode="contain"
					source={require("../assets/img/favorite_icon.png")}
				/>
			</TouchableOpacity>
		)}
		{!disableLikes && (
			<TouchableOpacity onPress={onDislikeClick}>
				<Image
					style={{
						margin: 8,
						width: 30,
						height: 30,
						marginHorizontal: 8,
						tintColor: "#e32003"
					}}
					resizeMode="contain"
					source={require("../assets/img/dislike_icon.png")}
				/>
			</TouchableOpacity>
		)}
	</View>
);

const pureButton: React.ComponentType<Props> = pure(KittyButtons);

export default pureButton;
