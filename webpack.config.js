//Konfiguracja Webpack
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['./src/sass/style.scss'],
    output: { filename: './src/css/style.css'
    },
    devServer: {
        inline: false,
        contentBase: './',
        port: 3001
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            }
        ]
    },
    plugins: [
    new ExtractTextPlugin({ filename: 'src/css/style.css', disable: false, allChunks: true })
    ]
};
