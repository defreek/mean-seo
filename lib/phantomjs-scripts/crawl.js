'use strict';

/**
 * Module dependencies
 */
var page = require("webpage").create(),
	system = require('system'),
	url = system.args[1];

/**
 * PhantomJS script
 */

page.onCallback = function() {
	console.log(page.content);
	page.close();
	phantom.exit();
};

page.open(url, function() {
	// page.evaluate(function() {
	//   setTimeout(function() {
	//     window.callPhantom();
	//   }, 10000);
	// });
});