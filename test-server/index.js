var http = require("http"),
    url = require("url"),
    fs = require("fs"),
    path = require("path"),
    serving = path.join(__dirname, '/public');

module.exports = function() {
  var server = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
    var filename = path.join(serving, uri);

    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      server.logged.push(uri);

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(file);
        response.end();
      });
    });
  }).listen();

  server.logged = [];

  return server;
};
