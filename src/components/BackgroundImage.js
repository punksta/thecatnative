// @flow
import * as React from "react";
import {Image, Dimensions, StyleSheet} from "react-native";
import {onlyUpdateForKeys} from "recompose";

const comp = () => (
	<Image
		style={styles.image}
		resizeMode="cover"
		source={require("../assets/img/background.png")}
	/>
);

export default onlyUpdateForKeys([])(comp);

const styles = StyleSheet.create({
	image: {
		position: "absolute",
		top: 0,
		left: 0,
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width
	}
});
