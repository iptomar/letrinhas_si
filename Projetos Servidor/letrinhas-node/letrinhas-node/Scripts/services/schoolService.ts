import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import uuid = require('node-uuid');
import path = require('path');
import mv = require('mv');
import app = require('../../app');

var poolQuery = Q.nbind<any>(pool.query, pool);
import School = require('../structures/schools/School');

export function all(): Q.Promise<Array<School>> {
    return poolQuery('SELECT * FROM Schools')
        .then((results) => results[0]);
}

export function details(id: number): Q.Promise<School> {
    return poolQuery(mysql.format('SELECT * FROM Schools WHERE id = ?', [id]))
        .then((results) => {
            if (results[0].length === 0) { return Q.resolve(null); }

            return results[0][0];
        });
}

export function createSchool(s: School, uploadedFilePath: string): Q.Promise<void> {
    // eg: appContent/Schools/uuid/logo.jpg
    var filePath = path.join('appContent/Schools', uuid.v4(), 'logo' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("Insert Into Schools(`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES(?,?,?)", [s.schoolAddress, filePath, s.schoolName]);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}

export function getAllSchools(onResult) {
    //realiza a query
    pool.query("SELECT * from Schools;", function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    name: rows[i].schoolName,
                    address: rows[i].schoolAddress,
                    photo : rows[i].schoolLogoUrl
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getAllSchools = getAllSchools;

export function getId(onResult) {
    //realiza a query
    pool.query("SELECT id, schoolName from Schools;", function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    name: rows[i].schoolName,
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getAllSchools = getAllSchools;

/**
 * Devolve os detalhes de uma escola selecionada
 * @author luisfmoliveira (Luís Oliveira)
 */
export function schoolDetails(schoolId: number): Q.Promise<School> {
    var sql = mysql.format("select * from Schools where id = ?", [schoolId]);

    return poolQuery(sql)
        .then((results) => results[0][0]);
}


export function updateSchool(s: School){
    // eg: appContent/Schools/uuid/logo.jpg
    var sql = mysql.format("UPDATE Schools SET schoolAddress = ?, schoolName= ? WHERE id = ?", [s.schoolAddress, s.schoolName, s.id]);
    return poolQuery(sql);
}

export function allSchoolClasses(): Q.Promise<Array<School>> {
    return poolQuery('select s.id as idEscola, s.schoolName, c.id as idTurma, c.classLevel, c.className, c.classYear from Schools as s, Classes as c where s.id = c.schoolId')
        .then((results) => results[0]);
}