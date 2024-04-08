const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
    mode: 'development',
    entry: {
        index: './ts/index.ts',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'ui/scriptsFromTs/'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
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