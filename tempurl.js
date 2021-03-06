var http = require('http')
  , fs = require('fs')
  , _ = require('underscore')
  , path = require('path')
  , os = require('os')
  , util = require('./util.js');

exports.download = function(url, callback) {
  var now = new Date();
  var tmpfn = path.join(os.tmpDir(), [
    "tmp-", now.getTime(), "-", Math.floor(Math.random()*1000000),
    ".", util.fileExt(url)
  ].join(""));
  console.log("Downloading " + url + " to " + tmpfn);
  var stream = fs.createWriteStream(tmpfn);
  var req = http.get(url, function(response) {
    response.pipe(stream);
    response.on("end", function() {
      stream.end();
      stream.destroy();
      stream.on("close", function() {
        callback(null,tmpfn, function() {
          fs.unlinkSync(tmpfn);
        });
      });
    });
  });
}
