import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';

export default class KittyLoader extends Component {
	constructor(props) {
		super(props);
		this.animationValue = new Animated.Value(0);
	}

	startAnimation = (onEnd) => {
		Animated.timing(
			this.animationValue,
			{
				toValue: 1,
				duration: 5000,
				easing: Easing.linear,
				useNativeDriver: true
			},
		).start(onEnd);
	};

	startAnimationRecursive = () => {
		this.animationValue.setValue(0);
		this.startAnimation(this.startAnimationRecursive)
	};

	componentDidMount() {
		this.startAnimationRecursive()
	}


	render() {
		if (this.props.progress > 0.8) {
			return null;
		}
		const spin = this.animationValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '1080deg']
		});

		return (
			<Animated.Image
				style={{
					width: 30,
					height: 30,
					transform: [{rotate: spin}]
				}}
				resizeMode={'contain'}
				source={require("../assets/img/cat_loader.png")}
			/>
		)
	}
}

