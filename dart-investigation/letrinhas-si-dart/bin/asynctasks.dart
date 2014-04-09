library asynctasks;

import 'package:sqljocky/sqljocky.dart' as _sql;

import 'dart:async' as _async;
import 'dart:convert' as _convert;
import 'package:crypto/crypto.dart' as _crypto;
import 'dart:io' as _io;
import 'server.dart';

// Create a connection pool to handle DB queries.
_sql.ConnectionPool _pool = new _sql.ConnectionPool(
  host: '192.168.56.101',
  user: 'psiapp',
  password: 'psiapp',
  db: 'letrinhas'
);

/// Fetches tests from the database, and returns them as a [Map].
_async.Future<Map<String, dynamic>> getTestsFromDb() {
  // First, execute the query.
  return _pool.query('SELECT * FROM Testes;')
      // Then, for each row of the result, add it to a list.
      .then((results) => results.toList())
      // Then, for each row, add its details to the output.
      .then((rows) {
        // Literal Map notation in dart. Dynamic is the value
        // because we don't know what's in there.
        var data = <String, dynamic> {
          'tests': <Map<String, dynamic>>[],
          'success': 1
        };

        // For each row, we'll add a new test
        // object to the test list.
        data['tests'] = rows.map((row) => {
          'id': row.id,
          'title': row.title,
          'text': row.textContent.toString(),
          'professorName': row.professorName,
          'maxTries': row.maxTries
        }).toList(growable: false);

        return data;
      })
      // If something goes wrong, we'll return an empty list
      // and success is set to zero.
      .catchError((e) {
        _printError(e);
        return <String, dynamic> {
          'tests': [],
          'success': 0
        };
      });
}

/// Receives a [json] string containing test resolution data,
/// parses it, and prints it to the console.
void printTests(String json) {
  Map<String, dynamic> dataToShow = _convert.JSON.decode(json);

  List<Map<String, dynamic>> tests = dataToShow['solvedTests'];

  tests.forEach((t) => t.forEach((k, v) {
    print('$k -> ${k == 'voiceBase64' ? new String.fromCharCodes(_crypto.CryptoUtils.base64StringToBytes(v)) : v}');
  }));

  _io.File f = new _io.File('D:/hello.txt');

  f.exists().then((exists) {
    if (!exists) {
      f.create(recursive: false).then((file) {
        f.writeAsBytes(_crypto.CryptoUtils.base64StringToBytes(tests[0]['voiceBase64']), mode: _io.FileMode.WRITE, flush: true);
      });
    }
  });
}

/// Receives a [json] string containing test resolution data,
/// parses it, and inserts it into the DB.
/// This is run asynchronously.
_async.Future saveResultsToDb(String json) {
  return _pool.prepare('INSERT INTO Resolucoes (testId, completionDate, studentName, voiceData) VALUES (?, ?, ?, ?)')
      .then((query) {
        printTests(json);

         // First, parse the text.
         Map<String, dynamic> dataToStore = _convert.JSON.decode(json);

         // Get the test list.
         List<Map<String, dynamic>> tests = dataToStore['solvedTests'];

         List<List> parameters = new List<List>();

         for (var test in tests) {
           var params = new List();
           params.add(test['testId']);
           params.add(test['completionDate']);
           params.add(test['studentName']);
           params.add(new String.fromCharCodes(_crypto.CryptoUtils.base64StringToBytes(test['voiceBase64'])));

           parameters.add(params);
         }

        // Run the query. If anything goes wrong, we'll tell as such.
        query.executeMulti(parameters).catchError(_printError);
      }).catchError(_printError);
}

void _printError(errorObject) {
  print('[${formatDate()}] Db Error.');
}
