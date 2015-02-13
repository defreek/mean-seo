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

page.settings.userAgent = '1roofbot';

page.onCallback = function() {
    console.log(page.content);
    page.close();
    phantom.exit();
};

page.onError = function(msg, trace) {
    // noop
};

page.open(url);

setTimeout(function(){
    console.log(page.content);
    phantom.exit();
},5000);
