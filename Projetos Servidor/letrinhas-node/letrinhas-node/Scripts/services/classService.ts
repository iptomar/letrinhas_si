
import Q = require('q');
import pool = require('../../configs/mysql');
import mysql = require('mysql');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Class = require('../structures/schools/Class');
import ProfessorClass = require('../structures/schools/ProfessorClass');

export function all(): Q.Promise<Array<Class>> {
    return poolQuery('SELECT * FROM Classes')
        .then((classes) => classes[0]);
}

export function professors(classId?: number): Q.Promise<Array<ProfessorClass>>  {
    return poolQuery('SELECT * FROM ProfessorClass' + (typeof classId !== 'undefined') ? ' WHERE classId = ' + classId : '')
        .then((results) => results[0]);
}

export function createClass(c: Class): Q.Promise<void> {
    var sql = mysql.format("Insert into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(?,?,?,?)", [c.schoolId, c.classLevel, c.className, c.classYear]);
    return poolQuery(sql);
}