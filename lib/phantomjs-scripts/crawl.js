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

page.set('onInitialized', function() {
	page.evaluate(function() {
	  setTimeout(function() {
	    window.callPhantom();
	  }, 10000);
	});
});
	
page.open(url);