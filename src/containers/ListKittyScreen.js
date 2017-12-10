import * as React from "react";
import {Text, StyleSheet, Dimensions, Image, View} from "react-native"
import {List} from "immutable";
import KittyList from "../components/KittyList";
import Api from "../api";
import withActiveRoute from "../navigation/withActiveRoute";
import {connect} from "react-redux";
import KittyListRecycler from "../components/KittyListRecycler";


class ListKittyScreen_ extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(newProps) {
		return newProps.isActive
	}

	render() {

		const {data, loadingState} = this.props.kittyList;

		const loading = loadingState === "loading" ||
			(loadingState === "refreshing" && data.size === 0);

		const refreshing = loadingState === "refreshing" && !loading

		return (
			<KittyListRecycler
				kitties={data}
				listStyle={styles.list}
				kittyStyle={styles.image}
				kittyStyle2={styles.image2}
				onRefresh={this.props.onRefresh}
				loading={loading}
				refreshing={refreshing}
				onEndReached={this.props.onLoadMore}
			/>
		)
	}
}


const ListKittyScreen = withActiveRoute(ListKittyScreen_);

ListKittyScreen.navigationOptions = ({
	header: () => null,
	tabBarIcon: ({tintColor, focused}) => (
		<Image
			source={require('../assets/img/few_cats_logo.png')}
			style={[focused ? styles.iconFocused : styles.icon, {tintColor: tintColor}]}
			resizeMode={'contain'}
		/>)

});

const mapToState = (state) => ({
	nav: state.nav,
	kittyList: state.kittyList
});

const dispatchToProps = (dispatch) => {
	return {
		onRefresh: () => dispatch({type: 'KITTY_LIST_REQUEST', refresh: true}),
		onLoadMore: () => dispatch({type: 'KITTY_LIST_REQUEST', refresh: false})
	}
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
	list: {
		flex: 1,
	},
	image: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
		backgroundColor: "#ffe1e1"
	},
	image2: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
		backgroundColor: "#fffecc"
	}
});
