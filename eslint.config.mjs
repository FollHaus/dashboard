// eslint.config.mjs
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs']
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
				__dirname: true,
				__filename: true
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-unsafe-member-access': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false
				}
			],
			'@typescript-eslint/no-extraneous-class': [
				'error',
				{
					allowEmptyCase: true,
					allowStaticOnly: false,
					allowWithDecorator: true
				}
			],
			'@typescript-eslint/require-await': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/prefer-readonly': 'off',
			'@typescript-eslint/no-inferrable-types': 'off'
		}
	}
)
