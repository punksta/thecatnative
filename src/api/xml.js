// @flow
const {Parser} = require("react-native-xml2js");

const parser = new Parser({explicitArray: false});

export const xmlToJson = <T>(str: string): Promise<T> =>
	new Promise((success, failure) => {
		parser.parseString(str, (err, result) => {
			if (err !== null) {
				failure(err);
			} else {
				success(result);
			}
		});
	});
