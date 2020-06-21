const path = require('path');

module.exports = env => {
  const isProduction = env === 'production';
  return {
    entry: './src/main.js',
    output: {
      path: path.join(__dirname, '/public'),
      filename: 'bundle.js',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? undefined : 'inline-source-map',
    devServer: isProduction
      ? undefined
      : {
          contentBase: 'public',
          //contentBase: path.join(__dirname, '/public/'),
          historyApiFallback: true,
          port: 3000,
        },
    //watch: !isProduction,
  };
};
