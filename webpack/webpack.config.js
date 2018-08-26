import webpack from 'webpack';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const port = 8080;
const host = 'localhost';
const location = 'https://' + host + ':' + port;
const entryPoiny = './index.js';
const PROD_BUNDLE_DIR_NAME = 'bundle';
const DEV_BUNDLE_DIR_NAME = 'dev';
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_SSL = process.env.SSL === 'true';
const IS_PROD = !IS_DEV;
const dist = IS_DEV ? DEV_BUNDLE_DIR_NAME : PROD_BUNDLE_DIR_NAME;
const publicPath = '/' + dist;

const loaders = [
    {
        loader: 'css-loader',
        options: { minimize: IS_PROD },
    },
    'sass-loader',
    {
        loader: 'sass-resources-loader',
        options: {
            resources: path.join('style', '_constants.scss'),
        },
    },
];

const commonPlugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        IS_DEV: JSON.stringify(IS_DEV),
        IS_PROD: JSON.stringify(IS_PROD),
    }),
];

const envPlugins = IS_DEV
    ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ]
    : [
        new CleanWebpackPlugin(PROD_BUNDLE_DIR_NAME, { dry: false, root: path.join(__dirname, '..') }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
            },
        }),
    ];

const config = {
    entry: IS_DEV
        ? [
            'react-hot-loader/patch',
            'webpack-dev-server/client?' + location,
            'webpack/hot/only-dev-server',
            entryPoiny,
        ]
        : [
            entryPoiny,
        ],

    output: {
        filename: 'bundle.js',
        path: path.resolve(dist),
        publicPath,
    },

    resolve: {
        modules: ['node_modules', './'],
    },

    devtool: IS_DEV ? 'inline-source-map' : false,

    plugins: [...commonPlugins, ...envPlugins],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: IS_PROD
                    ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: loaders,
                    })
                    : ['style-loader'].concat(loaders),
            },
        ],
    },
};

const devServer = {
    hot: true,
    port,
    publicPath,
    historyApiFallback: true,
    https: IS_SSL,
    proxy: {
        ['/' + PROD_BUNDLE_DIR_NAME]: {
            target: location,
            secure: false,
            changeOrigin: true,
            pathRewrite: { ['^/' + PROD_BUNDLE_DIR_NAME + '/']: '/' + DEV_BUNDLE_DIR_NAME + '/' },
            bypass: (req, res) => {
                if (req.url === '/' + DEV_BUNDLE_DIR_NAME + '/bundle.css') {
                    return res.sendStatus(200);
                }
            },
        },
    },
};

if (IS_DEV) {
    config.devServer = devServer;
}

module.exports = config;
