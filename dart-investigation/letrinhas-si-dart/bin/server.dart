library server;

import 'dart:io' as _io;
import 'asynctasks.dart' as tasks;
import 'dart:convert' as _convert;

void _fetchTests(_io.HttpRequest req) {
  tasks.getTestsFromDb()
      .then((data) {
        req.response.write(_convert.JSON.encode(data));
        req.response.close();

        print('[$formatDate()]Sent results to the client!');
      });
}

void _postResults(_io.HttpRequest req) {

  List<int> data = new List<int>();

  // Data from the request comes a byte array (list).
  req.listen((List<int> receivedData) {
    // We need to add all the data to a list first.
    data.addAll(receivedData);
  }, onDone: () {
    // Once we're done getting it all, we'll write out the data.
    // tasks.printTests(new String.fromCharCodes(data));
    tasks.saveResultsToDb(new String.fromCharCodes(data));
    req.response.close();
  });
}

void _handleRequest(_io.HttpRequest req) {
  // First, don't forget to add CORS headers, or the request will fail.
  _addCorsHeaders(req.response);

  var formattedDate = formatDate();

  print('[$formattedDate] Got a ${req.method} request to ${req.uri.path} from ${req.connectionInfo.remoteAddress.address}');

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

String formatDate() {
  var d = new DateTime.now();

  return '${d.hour}:${d.minute}:${d.second}.${d.millisecond}';
}

void _sendNotFound(_io.HttpRequest req) {
  print('Sending 404!');
  req.response.statusCode = 404;
  req.response.close();
}

void startServer() {
  _io.HttpServer.bind('0.0.0.0', 8080).then((server) {
    server.listen(_handleRequest);
  });

  print('Server running on 0.0.0.0:8080');
}

void _addCorsHeaders(_io.HttpResponse res) {
  res.headers.add("Access-Control-Allow-Origin", "*, ");
  res.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.headers.add("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
}
