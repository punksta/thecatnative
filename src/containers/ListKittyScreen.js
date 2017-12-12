import * as React from "react";
import {
	Share,
	Animated,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Image,
	View
} from "react-native";
import withActiveRoute from "../navigation/withActiveRoute";
import {connect} from "react-redux";
import KittyListRecycler from "../components/KittyListRecycler";
import type {Kitty} from "../api/types";
import ListSettingsView from "../components/ListSettingsView";
import type {ListSettings} from "../reducers/kittyList";
import type {ScrollEvent} from "../components/KittyListRecycler";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
	TouchableOpacity
);

class ListKittyScreen_ extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollY: new Animated.Value(50)
		};
		this.offSetY = 0;
		this._value = 50;
		this.state.scrollY.addListener(({value}) => (this._value = value));
	}

	shouldComponentUpdate(newProps) {
		return newProps.isActive;
	}

	shareKitty = (kitty: Kitty) => {
		Share.share({
			title: "Checkout nice kitty!",
			message: kitty.source_url
		});
	};

	renderHeader = data => {
		return (
			<ListSettingsView
				settings={data}
				onSettingsChanged={this.props.onSettingsChanged}
				rootViewStyle={styles.headerStyle}
			/>
		);
	};

	onTopPress = () => {
		this.refs["kittyList"] && this.refs["kittyList"].scrollToTop(true);
	};

	onScrollAnimated = (
		rawEvent: ScrollEvent,
		offsetX: number,
		offsetY: number
	) => {
		let diff = offsetY - this.offSetY;

		let current = this._value;
		let next = current;

		if (diff > 0) {
			// scroll down
			if (current < 50) {
				next = Math.min(current + diff, 50);
			}
		} else {
			// scroll up
			if (offsetY < Dimensions.get("window").height / 2) {
				// hide fab on top of kittyList
				next = 50;
			} else if (current > 0) {
				next = Math.max(current + diff, 0);
			}
		}

		if (Math.floor(next - current) !== 0) {
			this.state.scrollY.setValue(next);
		}
		this.offSetY = offsetY;
	};

	render() {
		const {data, loadingState} = this.props.kittyList;

		const loading =
			loadingState === "loading" ||
			(loadingState === "refreshing" && data.size === 0);

		const refreshing = loadingState === "refreshing" && !loading;

		const translateY = this.state.scrollY.interpolate({
			inputRange: [0, 50],
			outputRange: [0, 50]
		});

		return (
			<View style={styles.flex1}>
				<KittyListRecycler
					ref={"kittyList"}
					kitties={data}
					listStyle={styles.flex1}
					kittyStyle={styles.image}
					kittyStyle2={styles.image2}
					onRefresh={this.props.onRefresh}
					loading={loading}
					refreshing={refreshing}
					onEndReached={this.props.onLoadMore}
					onKittySharePress={this.shareKitty}
					headerData={this.props.kittyList.settings}
					renderHeader={this.renderHeader}
					onScroll={(...event) => this.onScrollAnimated(...event)}
				/>
				<Animated.View style={styles.fabWrapper}>
					<AnimatedTouchableOpacity
						style={{
							transform: [
								{
									translateY
								}
							]
						}}
						onPress={() => this.onTopPress()}
					>
						<Image
							style={styles.fabImage}
							source={require("../assets/img/top.png")}
						/>
					</AnimatedTouchableOpacity>
				</Animated.View>
			</View>
		);
	}
}

const ListKittyScreen = withActiveRoute(ListKittyScreen_);

ListKittyScreen.navigationOptions = {
	header: () => null,
	tabBarIcon: ({tintColor, focused}) => (
		<Image
			source={require("../assets/img/few_cats_logo.png")}
			style={[
				focused ? styles.iconFocused : styles.icon,
				{tintColor: tintColor}
			]}
			resizeMode={"contain"}
		/>
	)
};

const mapToState = state => ({
	nav: state.nav,
	kittyList: state.kittyList
});

const dispatchToProps = dispatch => {
	return {
		onRefresh: () => dispatch({type: "KITTY_LIST_REQUEST", refresh: true}),
		onLoadMore: () => dispatch({type: "KITTY_LIST_REQUEST", refresh: false}),
		onSettingsChanged: (settings: ListSettings) =>
			dispatch({type: "KITTY_LIST_SETTINGS_CHANGED", settings})
	};
};

export default connect(mapToState, dispatchToProps)(ListKittyScreen);

const styles = StyleSheet.create({
	icon: {
		width: 70,
		height: 35
	},
	iconFocused: {
		width: 80,
		height: 40
	},
	flex1: {
		flex: 1
	},
	fabWrapper: {
		position: "absolute",
		bottom: 0,
		end: 0
	},
	fabImage: {
		width: 50,
		height: 50,
		tintColor: "#2dfff5"
	},
	headerStyle: {
		padding: 8,
		backgroundColor: "rgba(131, 196, 245, 1)",
		height: 50,
		justifyContent: "center"
	},
	image: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
		backgroundColor: "rgba(131, 196, 245, 0.2)"
	},
	image2: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
		backgroundColor: "rgba(245, 131, 238, 0.2)"
	}
});
