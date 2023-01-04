// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		indent: ["off"],
		"linebreak-style": ["off", "windows"],
		quotes: ["warn", "double", { avoidEscape: true }],
		semi: ["error", "always"],
		"@typescript-eslint/no-empty-function": "warn",
		"no-empty": "warn",
		"no-case-declarations": "off",
		"no-async-promise-executor": "off",
	},
};
