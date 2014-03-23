library server;

import 'dart:io' as _io;
import 'asynctasks.dart' as tasks;

void _fetchTests(_io.HttpRequest req) {
  tasks.getTestsFromDb().then((jsonData) {
    req.response
        ..write(jsonData)
        ..close();

    print('Sent results to the client.');
  });
}

void _postResults(_io.HttpRequest req) {
  req.listen((List<int> data) {
    tasks.saveResultsToDb(new String.fromCharCodes(data));
    req.response.close();
  });
}

void _handleRequest(_io.HttpRequest req) {
  // First, don't forget to add CORS headers, or the request will fail.
  _addCorsHeaders(req.response);

  print('Got a ${req.method} request to ${req.uri.path}.');

  if (req.method == 'POST') {
    // Handle POST requests.

    switch (req.requestedUri.path) {
      case '/postTestResults':
        _postResults(req);
        break;
      default:
        _sendNotFound(req);
    }
  } else if (req.method == 'GET') {
    // Handle GET requests.

    switch (req.requestedUri.path) {
      case '/testList':
        _fetchTests(req);
        break;
      default:
        _sendNotFound(req);
    }
  } else {
    // If we got this far, it means something went wrong.
    _sendNotFound(req);
  }
}

void _sendNotFound(_io.HttpRequest req) {
  print('Sending 404!');
  req.response.statusCode = 404;
  req.response.close();
}

void startServer() {
  _io.HttpServer.bind('0.0.0.0', 8888).then((server) {
    server.listen((req) => _handleRequest(req));
  });

  print('Server running on 0.0.0.0:8888');
}

void _addCorsHeaders(_io.HttpResponse res) {
  res.headers.add("Access-Control-Allow-Origin", "*, ");
  res.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.headers.add("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
}
