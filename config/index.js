
require('dotenv').config({
	path: __dirname + "/config.env",
	silent: true
});
var settings = require(__dirname + '/settings.js');
// var env  = process.env.NODE_ENV || 'development';
module.exports = settings;
