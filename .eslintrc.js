module.exports = {
	"extends": [
		"airbnb",
		"plugin:flowtype/recommended",
		"plugin:react/recommended",
		"prettier",
		"prettier/flowtype",
		"prettier/react"
	],
	"plugins": [
		"flowtype",
		"react",
		"prettier",
		"react-native"
	],
	"parserOptions": {
		"ecmaVersion": 2017,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"env": {
		"es6": true,
		"node": true
	},
	"rules": {
		"no-use-before-define": 0,
		"react/prefer-stateless-function": 1,
		"no-shadow": 0,
		"no-return-assign": 1,
		"react-native/no-unused-styles": 1,
		"react-native/split-platform-components": 1,
		"no-underscore-dangle": 0,
		"global-require": 0,
		"prefer-destructuring": 0,
		"import/no-unresolved": 1,
		"no-param-reassign": 0,
		"consistent-return": 1,
		"react/no-multi-comp": 1,
		"no-confusing-arrow": 0,
		"react/jsx-filename-extension": 0,
		"no-console": 0,
		"prettier/prettier": "error",
		"no-unused-vars": 0,
		"import/first": 0,
		"import/prefer-default-export": 0,
		"no-case-declarations": 0,
		"react/display-name": 0,
		"react/prop-types": 0,
		"react/sort-comp": 0,
		"react/no-string-refs": 0,
		"no-unused-expressions": 0,
		"no-undef": 0,
		"react/no-unused-prop-types": 0,
		"no-plusplus" : 0
	},
};