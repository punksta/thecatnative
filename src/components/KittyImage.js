import * as React from "react"
import ImageProgress, {createImageProgress} from 'react-native-image-progress';
import KittyLoader from "./KittyLoader";
import {onlyUpdateForKeys} from "recompose"

import FastImage from 'react-native-fast-image'
import {View, Image} from "react-native";

const Im = createImageProgress(FastImage)

const KittyImage_ = ({url, style}) => {
	return <View
		style={style}
	>
		<FastImage
			source={{ uri: url }}
			resizeMode={'contain'}
			style={style}
		/>
	</View>
}

const hoc = onlyUpdateForKeys(['url', 'style'])

export const KittyImage = hoc(KittyImage_)