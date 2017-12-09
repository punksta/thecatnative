import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Share
} from 'react-native';
import Api from "../api";
import {KittyImage} from "../components/KittyImage";
import {connect} from "react-redux";
import withActiveRoute from "../navigation/withActiveRoute";


class SingleKittyScreen_ extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {}
	}

	newKitty = () => {
		Api.fetchKitty()
			.then(kitty => {
				this.setState({kitty});
				console.log(JSON.stringify(kitty))
			})
	};

	shareKitty = () => {
		Share.share({
			title: 'Checkout nice kitty!',
			message: this.state.kitty.source_url
		})
	}

	shouldComponentUpdate(newProps) {
		return newProps.isActive
	}

	render() {
		return (
			<View style={styles.container}>

				{this.state.kitty && <KittyImage
					style={styles.kittyStyle}
					url={this.state.kitty.url}
				/>}

				<TouchableOpacity
					style={styles.nextStyle}
					onPress={this.newKitty}>
					<Text
						style={styles.nextTextStyle}
					>
						Next
					</Text>
				</TouchableOpacity>


				{this.state.kitty && <TouchableOpacity
					style={styles.shareKitty}
					onPress={this.shareKitty}>
					<Image
						style={{
							width: 40,
							height: 40
						}}
						resizeMode={'contain'}
						source={require("../assets/img/share_icon.png")}
					/>
				</TouchableOpacity>
				}
			</View>
		);
	}

	componentWillMount() {
		this.newKitty()
	}
}
SingleKittyScreen = withActiveRoute(SingleKittyScreen_)

SingleKittyScreen.navigationOptions = ({
	header: () => null,
	tabBarIcon: ({ tintColor, focused }) => (
		<Image
			source={require('../assets/img/single_cat_logo.png')}
			style={[focused ? styles.iconFocused : styles.icon, {tintColor: tintColor}]}
			resizeMode={'contain'}
		/>
	),

});

const mapToState = (state) => ({
	nav: state.nav
});

export default connect(mapToState)(SingleKittyScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "#ffe1e1"
	},
	shareKitty: {
		position: 'absolute',
		end: 0,
		top: 0,
		margin: 8
	},
	kittyStyle: {
		flex: 1,
		width: Dimensions.get("window").width,
		height: null
	},
	nextStyle: {
		position: 'relative',
		marginTop: 'auto',
		backgroundColor: 'rgba(255, 64, 141, 0.4)',
		borderWidth: 2,
		borderColor: '#ff408d',
		padding: 8,
		paddingEnd: 40,
		paddingStart: 40,
		margin: 8,
	},
	nextTextStyle: {
		fontSize: 20,
		color: '#ffffff'
	},
	instructions: {
		textAlign: 'center',
		color: '#ffffff',
		marginBottom: 5,
	},
	icon: {
		width: 70,
		height: 35
	},
	iconFocused: {
		width: 80,
		height: 40
	},
});
