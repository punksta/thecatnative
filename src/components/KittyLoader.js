// @flow
import React, {Component} from "react";
import {Animated, Easing} from "react-native";
import type {EndCallback} from "react-native/Libraries/Animated/src/animations/Animation";

type Props = {
	progress?: number
};

export default class KittyLoader extends Component<Props> {
	animationValue: *;

	constructor(props: Props) {
		super(props);
		this.animationValue = new Animated.Value(0);
	}

	startAnimation = (onEnd: EndCallback) => {
		Animated.timing(this.animationValue, {
			toValue: 1,
			duration: 5000,
			easing: Easing.linear,
			useNativeDriver: true
		}).start(onEnd);
	};

	startAnimationRecursive = () => {
		this.animationValue.setValue(0);
		this.startAnimation(this.startAnimationRecursive);
	};

	componentDidMount() {
		this.startAnimationRecursive();
	}

	render() {
		const props = this.props;

		if (typeof props.progress === "number" && props.progress > 0.8) {
			return null;
		}
		const spin = this.animationValue.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "1080deg"]
		});

		return (
			<Animated.Image
				style={{
					width: 50,
					height: 50,
					transform: [{rotate: spin}]
				}}
				resizeMode="contain"
				source={require("../assets/img/cat_loader.png")}
			/>
		);
	}
}
