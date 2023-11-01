module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'commonjs': true,
	},
	'extends': 'eslint:recommended',
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'.eslintrc.{js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			}
		}
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-unused-vars': [
			'error',
			{
				'argsIgnorePattern': '^_',
				'varsIgnorePattern': '^_'
			}
		]
	},
	'globals': {
		'chrome': 'readonly',
		'importScripts': 'readonly',
		'CHAT_GPT_URL': 'readonly',
	}
};

