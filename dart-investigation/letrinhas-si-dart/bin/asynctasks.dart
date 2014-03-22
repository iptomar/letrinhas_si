library asynctasks;

import 'package:sqljocky/sqljocky.dart';

import 'dart:async';
import 'dart:io' as _io;
import 'dart:convert' as _convert;

// Create a connection pool to handle DB queries.
ConnectionPool _pool = new ConnectionPool(host: '192.168.56.101', user:
    'psiapp', password: 'psiapp', db: 'letrinhas');

/// Fetches tests from a database, and returns in JSON form.
Future<String> getTestsFromDb() {
  Completer completer = new Completer();

  // Query the DB.
  _pool.query('SELECT * FROM letrinhas.Testes;').then((Results res) {
    print('Got the results from the query!');

    // Prepare the structure which will be transformed to JSON.
    var data = <String, dynamic> {
      'tests': <Map<String, dynamic>>[]
    };

    res.forEach((Row row) {
      // For each row of the result, add the results to an object and
      // add the object to the list.
      data['tests'].add({
        'id': row.id,
        'title': row.title,
        'text': row.textContent.toString(),
        'professorName': row.professorName,
        'maxTries': row.maxTries
      });
    }).then((_) {
      // Serialize the map to JSON and send it down the request.
      completer.complete(_convert.JSON.encode(data));
    }, onError: (ex) => print('Something went wrong: ${ex.toString()}'));
  });

  print('Querying the database...');

  return completer.future;
}

/// Receives a [json] string containing test resolution data,
/// parses it, and inserts it into the DB.
/// This is run asynchronously.
Future saveResultsToDb(String json) {
  return new Future(() {
    // First, parse the text.
    Map<String, dynamic> dataToStore = _convert.JSON.decode(json);

    // Get the test list.
    List<Map<String, dynamic>> tests = dataToStore['solvedTests'];

    List<List> parameters = new List<List>();

    // Prepare an INSERT to the DB.
    _pool.prepare('INSERT INTO letrinhas.Resolucoes VALUES (?, ?, ?, ?, ?)'
        ).then((query) {
      // Add all the tests to the query.
      for (var test in tests) {
        parameters.add(test.values.toList(growable: false));
      }

      // Run the query. If anything goes wrong, we'll tell as such.
      query.executeMulti(parameters).catchError((ex) => print(ex.toString()));
    }, // If something goes wrong while preparing the query, tell it here.
    onError: (ex) => print('Unable to prepare query., ${ex.toString()}'));
  });
}
