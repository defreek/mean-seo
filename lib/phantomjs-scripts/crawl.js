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
	setTimeout(function() {
    	console.log(page.content);
    	phantom.exit();
  	}, 3000);
});