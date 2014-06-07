/// <reference path="../Scripts/typings/mysql/mysql.d.ts" />
var mysql = require('mysql');

/**
* Connection pool for this app.
*/
var pool = mysql.createPool({
    host: '192.168.56.101',
    user: 'psiapp',
    password: 'psiapp',
    database: 'letrinhas'
});

module.exports = pool;
//# sourceMappingURL=mysql.js.map
