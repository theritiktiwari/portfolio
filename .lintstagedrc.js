/**
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
	"src/**/*.{js,jsx,ts,tsx}": [
		"eslint --fix --max-warnings=0",
		"prettier --write",
	],
	"**/*.{css,scss,js,mjs,cjs,ts,json,md,yml,yaml}": [
		"prettier --write --ignore-unknown",
	],
};
