/// <reference path="../typings/q/q.d.ts" />
/// <reference path="../typings/mysql/mysql.d.ts" />


import Q = require('q');
import pool = require('../../configs/mysql');
import mysql = require('mysql');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Class = require('../structures/schools/Class');
import ProfessorClass = require('../structures/schools/ProfessorClass');

/**
 * @author redroserade (André Carvalho)
 */
export function all(): Q.Promise<Array<Class>> {
    // TODO: Restrict to current year.
    return poolQuery('SELECT * FROM Classes')
        .then((classes) => classes[0]);
}

export function details(id: number): Q.Promise<Class> {
    return poolQuery(mysql.format('SELECT * FROM Classes WHERE id = ?', [id]))
        .then((results) => Q.resolve(results[0].length === 0 ? null : results[0][0]));
}

export function professors(classId?: number): Q.Promise<Array<ProfessorClass>>  {
    var sql = 'SELECT * FROM ProfessorClass' + (!isNaN(classId) ? ' WHERE classId = ' + classId : '');
    return poolQuery(sql)
        .then((results) => results[0]);
}


export function createClass(c: Class): Q.Promise<void> {
    var sql = mysql.format("Insert into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(?,?,?,?)", [c.schoolId, c.classLevel, c.className, c.classYear]);
    return poolQuery(sql);
}

/**
 * Devolve uma lista de turmas, juntamente com o nome da escola respectiva.
 * @author luisfmoliveira (Luís Oliveira)
 */
export function classDetails(schoolId?: number): Q.Promise<Array<any>> {
    var sql = "select b.schoolName, a.classLevel, a.className, a.classYear, a.id, a.schoolId from Classes as a, Schools as b where a.schoolId = b.id";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND b.id = ?', [schoolId]);
    }

    return poolQuery(sql)
        .then((results) => results[0]);
}