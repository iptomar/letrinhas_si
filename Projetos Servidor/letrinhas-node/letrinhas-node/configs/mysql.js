/// <reference path="../Scripts/typings/mysql/mysql.d.ts" />
var mysql = require('mysql');
var Q = require('q');

/**
* Connection pool for this app.
*/
var pool = mysql.createPool({
    host: '192.168.56.101',
    user: 'psiapp',
    password: 'psiapp',
    database: 'letrinhas'
});


function query(sql, data) {
    var deferred = Q.defer();

    if (typeof data !== 'undefined') {
        pool.query(sql, data, function (err, rows, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(rows);
            }
        });
    } else {
        pool.query(sql, function (err, rows, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(rows);
            }
        });
    }

    return deferred.promise;
}
module.exports = pool;
//# sourceMappingURL=mysql.js.map
