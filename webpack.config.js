/* eslint-disable no-undef */

module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: '@shopify/slate-cssvar-loader',
          },
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ],
      },
    ],
  },
};
