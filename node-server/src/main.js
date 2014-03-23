var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  });

  var d = Date.now();

  res.end(d.toString());
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888/');