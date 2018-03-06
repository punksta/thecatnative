import {
	addNavigationHelpers,
	TabBarBottom,
	StackNavigator,
	TabNavigator
} from "react-navigation";
import SingleKittyScreen from "../containers/SingleKittyScreen";
import ListKittyScreen from "../containers/ListKittyScreen";

const MainScreenNavigator = TabNavigator(
	{
		ListKitty: {
			screen: ListKittyScreen
		},
		SingleKitty: {
			screen: SingleKittyScreen
		}
	},
	{
		tabBarPosition: "bottom",
		tabBarOptions: {
			showIcon: true,
			showLabel: false,
			iconStyle: {
				width: 80,
				height: 50
			}
		},
		tabBarComponent: TabBarBottom,
		cardStyle: {
			backgroundColor: "transparent"
		}
	}
);

export const AppNavigator = StackNavigator(
	{
		Main: {
			screen: MainScreenNavigator
		}
	},
	{
		cardStyle: {
			backgroundColor: "transparent"
		}
	}
);
