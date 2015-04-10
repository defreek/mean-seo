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
    // page.close();
    phantom.exit();
};

page.onError = function(msg, trace) {
    // noop
};

// do not load google analytics
page.onResourceRequested = function(requestData, request) {
    if ((/google-analytics\.com/gi).test(requestData['url']) || (/adsbygoogle/gi).test(requestData['url'])){
        request.abort();
    }
};

page.open(url);

setTimeout(function(){
    console.log(page.content);
    phantom.exit();
},5000);
