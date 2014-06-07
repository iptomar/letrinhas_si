﻿/// <reference path="../typings/q/q.d.ts" />
/// <reference path="../typings/mysql/mysql.d.ts" />
/// <reference path="../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mv/mv.d.ts" />
var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');
var uuid = require('node-uuid');
var path = require('path');
var mv = require('mv');
var app = require('../../app');
var fs = require('fs');

var poolQuery = Q.nbind(pool.query, pool);

function all(isActive) {
    if (typeof isActive === "undefined") { isActive = true; }
    return poolQuery('SELECT * FROM Professors WHERE isActive = ' + isActive).then(function (results) {
        return results[0];
    });
}
exports.all = all;

function details(id) {
    return poolQuery(mysql.format('SELECT * FROM Professors WHERE id = ?', [id])).then(function (results) {
        if (results[0].length === 0) {
            return Q.resolve(null);
        }

        return Q.resolve(results[0][0]);
    });
}
exports.details = details;

function createProfessor(p, uploadedFilePath) {
    // eg: appContent/Professors/uuid/picture.jpg
    var filePath = path.join('appContent/Professors', uuid.v4(), 'picture' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, true, filePath]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    }).then(function (result) {
        var insertedProfId = result[0].insertId;
        var classPairs = [];

        for (var i = 0; i < p.classIds.length; i++) {
            classPairs.push([insertedProfId, p.classIds[i]]);
        }

        // Inserir o professor numa turma.
        sql = 'insert into ProfessorClass(professorId, classId) VALUES ?';

        return poolQuery(sql, [classPairs]);
    }).catch(function (err) {
        return Q.nfcall(fs.unlink, path.join(app.rootDir, filePath)).thenReject(err);
    });
}
exports.createProfessor = createProfessor;

function getAllProfessors(onResult) {
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
exports.getAllProfessors = exports.getAllProfessors;

function getProfessorBySchoolId(id, onResult) {
    //realiza a query
    pool.query(mysql.format("select a. id, a.name, a.username, a.emailAddress,a.telephoneNumber,a.isActive,a.photoUrl,b.schoolName from Professors as a, Schools as b where a.schoolId = b.id and b.id = ?;", [id]), function (err, rows, fields) {
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
exports.getProfessorBySchoolId = exports.getProfessorBySchoolId;

/**
* Devolve uma lista de professores, juntamente com o nome da escola respectiva.
* @author luisfmoliveira (Luís Oliveira)
*/
function professorDetails(schoolId) {
    var sql = "select a. id, a.name, a.username, a.emailAddress,a.telephoneNumber,a.isActive,a.photoUrl,b.schoolName from Professors as a, Schools as b where a.schoolId = b.id";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND a.schoolId = ?', [schoolId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.professorDetails = professorDetails;

/**
* Devolve um de professor, juntamente com o nome da escola respectiva.
* @author luisfmoliveira (Luís Oliveira)
*/
function professorDetailsEdit(professorId) {
    var sql = "SELECT * FROM Professors WHERE";

    if (!isNaN(professorId)) {
        sql = mysql.format(sql + ' id = ?', [professorId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.professorDetailsEdit = professorDetailsEdit;

function editProfessor(p) {
    var sql = "UPDATE Professors SET";
    if (!isNaN(p.id) || !isNaN(p.schoolId)) {
        sql = mysql.format(sql + " schoolId = ?, name = ?, username = ?, password = ?, emailAddress = ?, telephoneNumber = ?, isActive = ? WHERE id = ? ", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, p.id]);
    }

    return poolQuery(sql).then(function (_) {
        return poolQuery(mysql.format('DELETE FROM ProfessorClass WHERE professorId = ?', [p.id]));
    }).then(function (_) {
        var classPairs = [];

        for (var i = 0; i < p.classIds.length; i++) {
            classPairs.push([p.id, p.classIds[i]]);
        }

        // Inserir o professor numa turma.
        sql = 'insert into ProfessorClass(professorId, classId) VALUES ?';

        return poolQuery(sql, [classPairs]);
    });
}
exports.editProfessor = editProfessor;
//# sourceMappingURL=professorService.js.map
