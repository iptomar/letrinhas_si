﻿var mysql = require('mysql');

/**
* Connection pool for this app.
*/
exports.pool = mysql.createPool({
    host: '192.168.56.101',
    user: 'psiapp',
    password: 'psiapp',
    database: 'letrinhas'
});
//# sourceMappingURL=mysql.js.map