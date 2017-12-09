import * as React from "react"
import Image from 'react-native-image-progress';
import KittyLoader from "./KittyLoader";
import {onlyUpdateForKeys} from "recompose"

const KittyImage_ = ({url, style}) => {
	return <Image
		source={{ uri: url }}
		indicator={KittyLoader}
		resizeMode={'contain'}
		style={style}
		/>
}

const hoc = onlyUpdateForKeys(['url', 'style'])

export const KittyImage = hoc(KittyImage_)