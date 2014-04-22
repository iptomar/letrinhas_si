import pool = require('../../configs/mysql');
import Q = require('q');


/**
 * The result of a SELECT query.
 */
export class SelectResult {
    constructor(public rows: Array<any>, public fields: any) { }
}

/**
 * Executes a SELECT query on the DB.
 * 
 * @param {String} sql The SQL to be used to query the DB.
 */
export function selectQuery(sql: string) {
    var deferred = Q.defer<SelectResult>();

    pool.query(sql, (err, rows, fields) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(<SelectResult> {
                rows: rows,
                fields: fields
            });
        }
    });

    return deferred.promise;
}

export function insertQuery(sql: string, values: any[]) {
    var deferred = Q.defer();

    pool.query(sql, [values], (err, result) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
}