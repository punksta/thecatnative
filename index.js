if (!__DEV__) {
	try {
		console.log = () => {}
	} catch (e) {
	}
}

import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('thecatnative', () => App);
