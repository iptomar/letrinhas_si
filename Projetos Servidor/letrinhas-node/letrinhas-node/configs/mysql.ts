/// <reference path="../Scripts/typings/mysql/mysql.d.ts" />

import mysql = require('mysql');
import Q = require('q');

/**
 * Connection pool for this app.
 */
var pool = mysql.createPool({
    host: '192.168.56.101', // TODO: Change this to use the environment path?
    user: 'psiapp',
    password: 'psiapp',
    database: 'letrinhas'
});

export = pool;