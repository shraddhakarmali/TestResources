var webpackCommonProd = require('./config/webpack.prod.js');

module.exports = function(options) {
    options = options || {};
    return webpackCommonProd(options);
};