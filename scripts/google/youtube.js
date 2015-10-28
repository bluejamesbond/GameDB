var fs = require('fs');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('underscore');

encodeQuery = function (q) {
  return q.replace(/\$/g, "%24")
    .replace(/\+/g, '%2B')
    .replace(/\s/g, '+')
    .replace(/&/g, "%26")
    .replace(/\//g, "%2F")
    .replace(/\=/g, "%3D")
    .replace(/%/g, "%25")
    .replace(/@/g, "%40")
    .replace(/#/g, "%23")
    .replace(/\?/g, "%3F")
    .replace(/;/g, "%3B")
    .replace(/,/g, "%2C")
    .replace(/['’]/g, "%27");
};

module.exports = function (opts, callback) {
  var q = encodeQuery(opts.q);
  var params = '';

  delete opts.q;

  for (var a in opts) {
    params += a + '=' + encodeURIComponent(opts[a]) + '&';
  }

  request({
    url: 'https://www.youtube.com/results?' + params + '&q=' + q,
    method: 'get',
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36',
      'accept-encoding': 'gzip, deflate, sdch',
      'accept-language': 'en-US,en;q=0.8,de;q=0.6',
      'cache-control': 'max-age=0',
      'referer': 'https://www.youtube.com/results?q=' + encodeQuery(q)  // MUST change every 50 or so requests
    },
    gzip: true
  }, function (err, res, body) {
    if (err) return callback(err, []);

    var $ = cheerio.load(body);
    var links = [];

    $('.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link').each(function(){
        links.push('https://www.youtube.com/embed/' + $(this).attr('href').replace('/watch?v=', '').replace(/&list=[^"]*/, ''));
    });

    callback(0, links);
  });
};