/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var qs = require('querystring');

var results = [];

var Message = function(username, message, roomname) {
  this.username = username;
  this.message = message;
  this.roomname = roomname;
};

var requestHandler = function(request, response) {

  var url = request.url;
  var method = request.method;

  console.log("Serving request type " + method + " for url " + url);

  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  var writer = function (  ) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({results: results}));
  }

  var bodyParser = function(req) {
    var body = '', parsedBody, data;
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      parsedBody = qs.parse(body);
      data = JSON.parse(Object.keys(parsedBody)[0]);
      results.push(new Message(data.username, data.message, data.roomname));
      writer();
    });
  };

  if (method === 'OPTIONS') {
    writer();
  } else if (method === 'GET') {
    if (url === '/log'
    || url === '/classes/messages'
    || url === '/classes/room1') {
      writer();
    } else {
      statusCode = 404;
      writer();
    }

  } else if (method === 'POST'){
    statusCode = 201;
    if ( url === '/classes/messages'
      || url === '/classes/room1'
      || url === '/send') {
      bodyParser(request);
    } else {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }

};

module.exports.requestHandler = requestHandler;

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
