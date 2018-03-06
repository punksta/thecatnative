// @flow

import * as React from "react";
import {createImageProgress} from "react-native-image-progress";
import KittyLoader from "./KittyLoader";
import {onlyUpdateForKeys} from "recompose";

import FastImage from "react-native-fast-image";
import {View, Image, StyleSheet} from "react-native";
import KittyButtons from "./KittyButtons";

const ImageProgress = createImageProgress(Image);

const KittyImage_ = ({url, style, kittyLoader, buttonsProps}) => {
	const ImageComponent = kittyLoader ? ImageProgress : Image;
	return (
		<View style={style}>
			<ImageComponent
				source={{uri: url}}
				resizeMode="contain"
				style={styles.container}
				indicator={KittyLoader}
			/>
			<KittyButtons {...buttonsProps} />
		</View>
	);
};

const hoc = onlyUpdateForKeys(["url", "style"]);

export const KittyImage = hoc(KittyImage_);

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
