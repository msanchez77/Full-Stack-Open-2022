const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
	console.log('argv', argv.mode)

	const backend_url = argv.mode === 'production'
		? 'https://obscure-harbor-49797.herokuapp.com/api/anecdotes'
		: 'http://localhost:3001/anecdotes'

  return {
		entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'main.js'
		},
		devServer: {
			static: path.resolve(__dirname, 'build'),
			compress: true,
			port: 3000,
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react','@babel/preset-env'],
					},
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				BACKEND_URL: JSON.stringify(backend_url)
			})
		]
	}
}
module.exports = config