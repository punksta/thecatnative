// @flow
import React, {Component, PureComponent} from "react";
import {Animated, Easing} from "react-native";
import type {EndCallback} from "react-native/Libraries/Animated/src/animations/Animation";

type Props = {
	progress?: number,
	size: number
};

export default class KittyLoader extends PureComponent<Props> {
	animationValue: *;

	static get defaultProps(): Props {
		return {
			size: 150
		};
	}

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
		const {progress, size} = this.props;

		if (typeof progress === "number" && progress > 0.8) {
			return null;
		}
		const spin = this.animationValue.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "1080deg"]
		});

		return (
			<Animated.Image
				style={{
					width: size,
					height: size,
					transform: [{rotate: spin}]
				}}
				resizeMode="contain"
				source={require("../assets/img/cat_loader.png")}
			/>
		);
	}
}
