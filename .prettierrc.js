/** @type {import("prettier").Config} */
module.exports = {
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "es5",
	printWidth: 100,
	bracketSpacing: true,
	arrowParens: "always",
	endOfLine: "auto",
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: ["*.astro"],
			options: {
				parser: "astro",
			},
		},
		{
			files: ["*.yml", "*.yaml", "*.md", "*.mdx"],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
