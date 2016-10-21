var webpackCommonDev = require('./config/webpack.dev.js');

const devPort = 8080;

module.exports = function(options) {
    options = options || {};
    options.devPort = devPort;
    return webpackCommonDev(options);
};