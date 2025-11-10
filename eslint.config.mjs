// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default withNuxt(
  // Your custom configs here
  [
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    }
  ],
  eslintConfigPrettier
)
