import mysql = require('mysql');

/**
 * Connection pool for this app.
 */
export var pool = mysql.createPool({
    host: '192.168.56.101', // TODO: Change this to use the environment path?
    user: 'psiapp',
    password: 'psiapp',
    database: 'letrinhas'
});