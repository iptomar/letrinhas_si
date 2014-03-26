library asynctasks;

import 'package:sqljocky/sqljocky.dart' as _sql;

import 'dart:async' as _async;
import 'dart:convert' as _convert;

// Create a connection pool to handle DB queries.
_sql.ConnectionPool _pool = new _sql.ConnectionPool(host: '192.168.56.101',
    user: 'psiapp', password: 'psiapp', db: 'letrinhas');

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

        // Here we add all the results to the map.
        for (var row in rows) {
          data['tests'].add({
            'id': row.id,
            'title': row.title,
            'text': row.textContent.toString(),
            'professorName': row.professorName,
            'maxTries': row.maxTries
          });
        }

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

  for (var test in tests) {
    for (var key in test.keys) {
      print('$key -> ${test[key]}');
    }
    print('');
  }
}

/// Receives a [json] string containing test resolution data,
/// parses it, and inserts it into the DB.
/// This is run asynchronously.
_async.Future saveResultsToDb(String json) {
  return new _async.Future(() {
    // First, parse the text.
    Map<String, dynamic> dataToStore = _convert.JSON.decode(json);

    // Get the test list.
    List<Map<String, dynamic>> tests = dataToStore['solvedTests'];

    List<List> parameters = new List<List>();

    // Prepare an INSERT to the DB.
    _pool.prepare('INSERT INTO Resolucoes VALUES (?, ?, ?, ?, ?)').then((query) {
      // Add all the tests to the query.
      for (var test in tests) {
        parameters.add(test.values.toList(growable: false));
      }

      // Run the query. If anything goes wrong, we'll tell as such.
      query.executeMulti(parameters).catchError(_printError);
    }, // If something goes wrong while preparing the query, tell it here.
    onError: _printError);
  });
}

void _printError(errorObject) {
  print('Error: ${errorObject.toString()}');
}
