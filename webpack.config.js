const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions
const NodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = function (options, webpack) {
	return {
		...options,
		mode: 'development',
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: {
						loader: 'swc-loader',
						options: swcDefaultConfig
					}
				}
			]
		},
		// Sử dụng single entry point để tránh out of memory
		entry: ['webpack/hot/poll?100', options.entry],
		externals: [
			NodeExternals({
				allowlist: ['webpack/hot/poll?100']
			})
		],
		plugins: [
			...options.plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.WatchIgnorePlugin({
				paths: [/\.js$/, /\.d\.ts$/]
			}),
			new RunScriptWebpackPlugin({
				autoRestart: true
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'src/i18n',
						to: 'i18n'
					}
				]
			})
		],
		resolve: {
			extensions: ['.ts', '.js', '.json'],
			plugins: [
				new TsconfigPathsPlugin({
					configFile: path.resolve(__dirname, 'tsconfig.json')
				})
			]
		},
		output: {
			path: path.join(__dirname, 'dist')
		}
	}
}
