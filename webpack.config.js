const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'ts', 'index.ts'),
    },
    output: {
        filename: 'bundle.[chunkhash].js',
        path: path.join(__dirname, 'ui', 'scriptsFromTs'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'ui', 'index.html'),
            filename: path.join(__dirname, 'html', 'index.html'),
            inject: 'body',
            scriptLoading: 'defer',
        }),
    ],
};

const prodConfig = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};

module.exports = merge(baseConfig, prodConfig);