var pool = require('../../configs/mysql');
var Q = require('q');

/**
* The result of a SELECT query.
*/
var SelectResult = (function () {
    function SelectResult(rows, fields) {
        this.rows = rows;
        this.fields = fields;
    }
    return SelectResult;
})();
exports.SelectResult = SelectResult;

/**
* Executes a SELECT query on the DB.
*
* @param {String} sql The SQL to be used to query the DB.
*/
function selectQuery(sql) {
    var deferred = Q.defer();

    pool.query(sql, function (err, rows, fields) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({
                rows: rows,
                fields: fields
            });
        }
    });

    return deferred.promise;
}
exports.selectQuery = selectQuery;

function insertQuery(sql, values) {
    var deferred = Q.defer();

    pool.query(sql, [values], function (err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}
exports.insertQuery = insertQuery;
//# sourceMappingURL=promiseBasedMySql.js.map
