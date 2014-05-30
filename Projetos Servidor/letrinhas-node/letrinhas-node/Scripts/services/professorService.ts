
import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import uuid = require('node-uuid');
import path = require('path');
import mv = require('mv');
import app = require('../../app');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Professor = require('../structures/schools/Professor');

export function all(isActive = true): Q.Promise<Array<Professor>> {
    return poolQuery('SELECT * FROM Professors WHERE isActive = ' + isActive)
        .then((results) => results[0]);
}

export function details(id: number): Q.Promise<Professor> {
    return poolQuery(mysql.format('SELECT * FROM Professors WHERE id = ?', [id]))
        .then((results) => {
            if (results[0].length === 0) { return Q.resolve(null); }

            return Q.resolve(results[0][0]);
        });
}

export function createProfessor(p: Professor, uploadedFilePath: string): Q.Promise<any> {

    // eg: appContent/Professors/uuid/picture.jpg
    var filePath = path.join('appContent/Professors', uuid.v4(), 'picture' + path.extname(uploadedFilePath)).replace(/\\/g, '/');


    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, filePath]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}

export function getAllProfessors(onResult) {
    //realiza a query
    pool.query("select a. id, a.name, a.username, a.emailAddress,a.telephoneNumber,a.isActive,a.photoUrl,b.schoolName from Professors as a, Schools as b where a.schoolId = b.id;", function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    name: rows[i].name,
                    username: rows[i].username,
                    email: rows[i].emailAddress,
                    telephone: rows[i].telephoneNumber,
                    isActive: rows[i].isActive,
                    photo: rows[i].photoUrl,
                    schoolName: rows[i].schoolName
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getAllProfessors = getAllProfessors;

export function getProfessorBySchoolId(id: number, onResult) {
    //realiza a query
    pool.query(mysql.format("select a. id, a.name, a.username, a.emailAddress,a.telephoneNumber,a.isActive,a.photoUrl,b.schoolName from Professors as a, Schools as b where a.schoolId = b.id and b.id = ?;",[id] ), function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    name: rows[i].name,
                    username: rows[i].username,
                    email: rows[i].emailAddress,
                    telephone: rows[i].telephoneNumber,
                    isActive: rows[i].isActive,
                    photo: rows[i].photoUrl,
                    schoolName: rows[i].schoolName
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getProfessorBySchoolId = getProfessorBySchoolId;


/**
 * Devolve uma lista de professores, juntamente com o nome da escola respectiva.
 * @author luisfmoliveira (Luís Oliveira)
 */
export function professorDetails(schoolId?: number): Q.Promise<Array<any>> {
    var sql = "select a. id, a.name, a.username, a.emailAddress,a.telephoneNumber,a.isActive,a.photoUrl,b.schoolName from Professors as a, Schools as b where a.schoolId = b.id";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND a.schoolId = ?', [schoolId]);
    }

    return poolQuery(sql)
        .then((results) => results[0]);
}