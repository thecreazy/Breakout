const { resolve } = require('path')
const webpack = require('webpack')

// Configuration
const {
	root,
	src,
	dist,
	seo
} = require('./config')

// List of imported plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractText = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const HtmlCriticalPlugin = require("html-critical-webpack-plugin")
// const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = (env) => {

	const isProd = env && env.production
	const isAnalyzing = env && env.analyze

	let plugins = []

	plugins.push(
		new webpack.DefinePlugin({
				'process.env.NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development')
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: resolve(__dirname, '../public/index.html'),
			minify: {
				removeComments: isProd,
				collapseWhitespace: isProd,
				removeRedundantAttributes: isProd,
				useShortDoctype: isProd,
				removeEmptyAttributes: isProd,
				removeStyleLinkTypeAttributes: isProd,
				keepClosingSlash: isProd,
				minifyJS: isProd,
				minifyCSS: isProd,
				minifyURLs: isProd
			}
		}),
		new CleanWebpackPlugin([
			dist
		], {
			root: root,
			verbose: true,
			dry: false
		}),
		new CopyWebpackPlugin([{
			context: src,
			from: './static',
			to: dist
		}]),
	)

	if (!isProd) {
		// Development plugins
		plugins.push(
			new webpack.HotModuleReplacementPlugin()
		)
	}else{
		plugins.push(
			new ExtractText('[name].[contenthash:8].css'),
			new BabiliPlugin()
		)
	}

	if (isAnalyzing) {
		plugins.push(
			new BundleAnalyzerPlugin()
		)
	}

	return plugins
}
