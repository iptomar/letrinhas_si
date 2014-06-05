/*
 * Routes related to students.
 */
import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import uuid = require('node-uuid');
import path = require('path');
import mv = require('mv');
import app = require('../../app');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Student = require('../structures/schools/Student');

// GET: /Students/All/
export function all(): Q.Promise<Array<Student>> {
    return poolQuery('SELECT * FROM Students WHERE isActive = true')
        .then((students) => students[0]);
}

// GET: /Students/Details/:id
export function details(id: number): Q.Promise<Student> {
    return poolQuery(mysql.format('SELECT * FROM Students WHERE id = ? AND isActive = 1', [id]))
        .then((students) => {
            if (students[0].length === 0) { return Q.resolve(null); }

            return students[0][0];
        });
}

// POST: /Students/Create/
export function create(s: Student, uploadedFilePath: string) {
    // eg: appContent/Students/uuid/picture.jpg
    var filePath = path.join('appContent/Students', uuid.v4(), 'picture' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    // A student is active by default.
    var sql = mysql.format("Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(?,?,?,?)", [s.classId, s.name, filePath, true]);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}


/**
 * Devolve uma lista de alunos de uma turma, juntamente com o nome da escola respectiva.
 * @author luisfmoliveira (Luis Oliveira)
 */
export function studentDetails(schoolId = null, classId = null): Q.Promise<Array<any>> {
    var sql =
        "select s.id, s.classId, s.name, s.photoUrl, s.isActive, t.schoolName, c.className " +
        "from Students as s " +
        "join Classes as c on c.id = s.classId " +
        "join Schools as t on t.id = c.schoolId " +
        "where true";

    if (schoolId !== null && !isNaN(schoolId)) {
        sql = mysql.format(sql + ' and t.id = ?', [schoolId]);
    }

    if (classId !== null && !isNaN(classId)) {
        sql = mysql.format(sql + ' and c.id = ?', [classId]);
    }

    return poolQuery(sql)
        .then((results) => results[0]);
}