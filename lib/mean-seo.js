'use strict';

/*!
 * MEAN - SEO
 * Ported from https://github.com/meanjs/mean-seo
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    browser = require('./browser'),
    Cache = require('./cache');

/**
 * Module default options
 */
var defaultOptions = {
    cacheClient: 'disk',
    cacheDuration: 2 * 60 * 60 * 24 * 1000,
    cacheFolder: __dirname + '/../tmp/mean-seo/cache'
};

function isBot(useragent) {
    if (!useragent) return false;

    var agent = useragent.toLowerCase();

    return agent.indexOf('facebookexternalhit') !== -1 || agent.indexOf('facebot') !== -1 || agent.indexOf('twitterbot') !== -1;
}

/**
 * SEO:
 *
 * Renders static pages for crawlers
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
exports.init = function(options) {
    //Initialize local variables
    options = _.merge(defaultOptions, options || {});
    var cache = new Cache(options);

    return function SEO(req, res, next) {
        var escapedFragment = req.query._escaped_fragment_;
        var isKnowBot = isBot(req.headers['user-agent']);

        //If the request came from a crawler
        if (escapedFragment !== undefined || isKnowBot) {
            var url, key;

            if (escapedFragment && escapedFragment.length > 0) {
                // If the request is in # style.
                url = req.protocol + '://' + req.get('host') + req.path + '#!/' + escapedFragment;
                // Use the escapedFragment as the key.
                key = escapedFragment;
            } else {
                // If the request is in HTML5 pushstate style.
                url = req.protocol + '://' + req.get('host') + req.originalUrl;

                if (isKnowBot) {
                    if (url.indexOf('?') !== -1) url += '?fragment_data=';
                    else url += '&fragment_data=';
                } else {
                    // Rename key to stop Phantom from going into an infinite loop.
                    url = url.replace('_escaped_fragment_', 'fragment_data');
                }

                // Use the url as the key.
                key = url;
            }

            cache.get(key.replace('1roof.be', 'apollo2.herokuapp.com'), function(err, page) {
                if (err) {
                    //If not in cache crawl page
                    browser.crawl(key, function(err, html) {
                        if (err) {
                            next(err);
                        } else {
                            //Save page to cache
                            cache.set(key, html, function(err, res) {
                                if (err) {
                                    next(err);
                                }
                            });

                            //And output the result
                            res.send(html);
                        }
                    });
                } else {
                    //If page was found in cache, output the result
                    res.send(page.content);
                }
            });
        } else {
            next();
        }
    };
};

exports.forceCache = function(options, callback) {
    //Initialize local variables
    options = _.merge(defaultOptions, options || {});
    var cache = new Cache(options);

    browser.crawl(options.url.replace('1roof.be', 'apollo2.herokuapp.com'), function(err, html) {
        if (err) {
            callback(err);
        } else {
            //Save page to cache
            cache.set(options.url, html, function(err, res) {
                if (err) {
                    callback(err);
                }
            });

            //And output the result
            callback(null, html);
        }
    });
};
