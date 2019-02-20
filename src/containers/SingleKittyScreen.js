// @flow
import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Share
} from "react-native";
import {KittyImage} from "../components/KittyImage";
import {connect} from "react-redux";
import withActiveRoute from "../navigation/withActiveRoute";

import type {State as SingleKittyState} from "../reducers/singleKitty";
import type {ScreenProps} from "../navigation/ScreenProps";
import type {Kitty} from "../api/types";

type SpecialProps = {
	singleKittyState: SingleKittyState,
	requestKitty: (id?: string) => void,
	nav: *
};

type Props = ScreenProps & SpecialProps;

class SingleKittyScreen_ extends Component<Props> {
	newKitty = (id?: string) => {
		this.props.requestKitty(id);
	};

	shareKitty = () => {
		const kitty: ?Kitty = this.props.singleKittyState.kitty;

		if (kitty)
			Share.share({
				title: "Checkout nice kitty!",
				message: kitty.url
			});
	};

	shouldComponentUpdate(newProps) {
		return newProps.isActive;
	}

	render() {
		const {kitty} = this.props.singleKittyState;

		return (
			<View style={styles.container}>
				{kitty && (
					<KittyImage
						kittyLoader
						style={styles.kittyStyle}
						url={kitty.url}
						buttonsProps={{
							onShareClick: this.shareKitty,
							onLikeClick: () => {},
							onDislikeClick: () => {}
						}}
					/>
				)}

				<TouchableOpacity
					style={styles.nextStyle}
					onPress={() => this.newKitty()}
				>
					<Text style={styles.nextTextStyle}>Next</Text>
				</TouchableOpacity>
			</View>
		);
	}

	requestKittyIfRequired = () => {
		if (
			!this.props.singleKittyState.kitty &&
			this.props.singleKittyState.loading === null
		) {
			this.props.requestKitty();
		}
	};

	componentDidUpdate(oldProps) {
		if (!oldProps.isActive && this.props.isActive) {
			this.requestKittyIfRequired();
		}
	}

	componentDidMount() {
		if (this.props.isActive) {
			this.requestKittyIfRequired();
		}
	}
}

const SingleKittyScreen = withActiveRoute(SingleKittyScreen_);

// $FlowFixMe
SingleKittyScreen.navigationOptions = {
	header: () => null,
	tabBarIcon: ({tintColor, focused}) => (
		<Image
			source={require("../assets/img/single_cat_logo.png")}
			style={[focused ? styles.iconFocused : styles.icon, {tintColor}]}
			resizeMode="contain"
		/>
	)
};

const mapToState = state => ({
	nav: state.nav,
	singleKittyState: state.singleKitty
});

const mapDispatchToProps = dispatch => ({
	requestKitty: (id?: string) =>
		dispatch({
			type: "SINGLE_KITTY_REQUEST",
			id
		})
});

export default connect(
	mapToState,
	mapDispatchToProps
)(SingleKittyScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(131, 196, 245, 0.2)"
		// backgroundColor: "#ffe1e1"
	},
	// shareKitty: {
	// 	position: "absolute",
	// 	end: 0,
	// 	top: 0,
	// 	margin: 8
	// },
	kittyStyle: {
		flex: 1,
		width: Dimensions.get("window").width,
		height: null
	},
	nextStyle: {
		position: "relative",
		marginTop: "auto",
		backgroundColor: "#ff3a38",
		borderWidth: 0.5,
		borderColor: "#474747",
		borderRadius: 8,
		elevation: 4,
		padding: 8,
		paddingEnd: 50,
		paddingStart: 50,
		margin: 8
	},
	nextTextStyle: {
		fontSize: 20,
		color: "#ffffff"
	},
	icon: {
		width: 70,
		height: 35
	},
	iconFocused: {
		width: 80,
		height: 40
	}
});
