module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"header-max-length": [2, "always", 150], // max length for commit header
		"type-enum": [
			2,
			"always",
			["feat", "fix", "chore", "docs", "style", "refactor", "perf", "test", "ci"],
		],
		"subject-case": [0],
		"body-leading-blank": [0],
	},
};
