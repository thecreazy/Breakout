const webpack = require('webpack')
const ExtractText = require('extract-text-webpack-plugin')

// Plugins
const plugins = require('./plugins')
// Configuration
const {
	src,
	public,
	dist,
	exclude,
	browserList
} = require('./config')

module.exports = env => {

	// Get the env variable
	const isProd = env && env.production
	const PORT = process.env.PORT || 3000

	return {
		context: src,
		entry: {
			main: './index.js'
		},
		output: {
			path: dist,
			filename: '[name].[hash:8].js',
			publicPath: '/'
		},
		resolve: {
			extensions: ['.js', '.json'],
			alias: {
				'@': src
			}
		},
		// Dev server configuration
		devServer: {
			contentBase: public,
			compress: isProd ? true : false, // Enable gzip only in produciton
			port: PORT,
			hot: true,
			watchContentBase: true,
			allowedHosts: [
				'caffeina.be',
			],
			stats: "errors-only"
		},
		module: {
			rules: [
				// Lint task with enforce 'pre'
				// {
				//   enforce: 'pre',
				// },
				{
					test: /\.js$/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: [
								['es2015', { modules: false }]
							]
						}
					}],
					exclude: exclude
				},
				{
					test: /\.(ttf|woff|otf|png|svg|jpg)$/,
					use: [
						'url-loader?limit=10000',
						{
							loader: 'img-loader',
							options: {
								enabled: isProd,
								gifsicle: {
									interlaced: false
								},
								mozjpeg: {
									progressive: true,
									arithmetic: false
								},
								optipng: false, // disabled
								pngquant: {
									floyd: 0.5,
									speed: 2
								},
								svgo: {
									plugins: [
										{ removeTitle: true },
										{ convertPathData: false }
									]
								}
							}
						},
						'file-loader'
					],
					exclude: exclude
				},
				{
					test: /\.css$/,
					loader: isProd ? ExtractText.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: 1,
									importLoaders: 1
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: (loader) => [
										require('autoprefixer')({
											browsers: browserList
										}),
										require('cssnano')()
									]
								}
							}
						]
					}) : [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: (loader) => [
									require('autoprefixer')({
										browsers: browserList
									})
								]
							}
						}
					],
					exclude: exclude
				}
			]
		},
		plugins: plugins(env),
		// We generate sourcemaps in production. This is slow but gives good results.
		// You can exclude the *.map files from the build during deployment.
		devtool: isProd ? 'source-map' : 'eval'
	}

}
