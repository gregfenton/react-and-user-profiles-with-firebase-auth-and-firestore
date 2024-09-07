// @ts-skip

import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  prettierConfig,
  eslintPluginPrettierRecommended,
  {
    // This `ignores` has to be in an object of its own: https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706

    // node_modules and .git are ignored by default
    ignores: [".husky/**", ".vscode/**", "bin/", "build/", "public/"],
  },
  {
    files: ["**/*.{js,jsx}"],

    rules: {
      "@typescript-eslint/no-non-null-assertion": "off", // would like to enable this in the future :)
      "@typescript-eslint/no-empty-function": "off", // I would like to enable this in the future :)

      "no-undef": "off",
      "@typescript-eslint/prefer-for-of": "off",

      "no-unused-expressions": "off", // turn off the base rule to use the @typescript-eslint version
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: ".*",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
