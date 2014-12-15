'use strict';

/**
 * Module dependencies
 */
var phantom = require('node-phantom-simple');

/**
 * Crawl the page
 */
exports.crawl = function(url, callback) {


  var options = {
    phantomPath: require('phantomjs').path,
    parameters: {
      'disk-cache': 'no',
      'ignore-ssl-errors': 'true',
      'load-images': 'false',
      'local-to-remote-url-access': 'yes'
    }
  };

  phantom.create(function(err, ph) {
    if (err) {
      console.error(err);
      return callback(err);
    }

    return ph.createPage(function(err,page) {

      page.onCallback = function() {
        page.get('content', function(err, content) {
           callback(err, content);
           page.release();
           page.close();
           page = null;
           ph.exit();
        });
      };

      page.set('onInitialized', function() {
        page.evaluate(function() {
          setTimeout(function() {
            console.log('no callback detected ...');
            window.callPhantom();
          }, 10000);
        });
      });

      return page.open(url);
    });
  }, options);

};