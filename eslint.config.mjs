import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig(
	tseslint.configs.recommended,
	{
		ignores: ["dist/**", "out/**", ".astro/**", "**/*.config.*"],
	},
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", ignoreRestSiblings: true },
			],
			"@typescript-eslint/no-explicit-any": "off",
			"no-debugger": "error",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "error",
			"no-var": "error",
			"no-undef": "off",
		},
	},
	eslintConfigPrettier
);

export default eslintConfig;
