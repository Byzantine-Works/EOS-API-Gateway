
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = {
    mode: 'development',
    resolve: {
      extensions: [
        '.js',
        '.jsx',
        '.css',
      ],
    },
    module: {
      rules: [{
        test: /\.js$|\.jsx$/,
        include: /src/,
        use: 'babel-loader',
        exclude: /node_modules/,
        // options: {
        //     presets: ['react']
        // }
      },
      {
        test: /\.scss$|\.css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
    {
        test: /\.html$/,
        use: 'html-loader',
    }]
},
    plugins: [htmlPlugin],
}