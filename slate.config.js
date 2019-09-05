const path = require('path');

const alias = {
  // jquery: path.resolve('./node_modules/jquery'),
  // lodash-es is only for `slate-tool build`. 2018-05-22
  'lodash-es': path.resolve('./node_modules/lodash-es'),
};

// external vendors to reduce the vendor size.
const externals = {
  jquery: 'jQuery',
  swiper: 'Swiper',
};

/* eslint-disable no-undef */
module.exports = {
  // 'webpack.babel.enable': false,
  'cssVarLoader.enable': true,
  'cssVarLoader.liquidPath': ['src/snippets/css-variables.liquid'],
  'webpack.extend': {
    resolve: {
      alias,
    },
    externals,
  },
};
