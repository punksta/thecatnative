if (!__DEV__) {
	try {
		console.log = () => {}
	} catch (e) {
	}
}

import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('thecatnative', () => App);
