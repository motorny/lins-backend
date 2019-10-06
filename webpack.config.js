const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use:  {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },

        }],
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/](node_modules|vendor)[\\/]/,
                },
            },
        },
    },
    devtool: 'source-map',
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        hot: true,
        port: 9000,
        contentBase: './build',
        publicPath: '/',
        compress: true,
        clientLogLevel: 'info',
        overlay: true,
        stats: {
            assets: false,
            colors: true,
            cached: false,
            cachedAssets: false,
        },
    },
};