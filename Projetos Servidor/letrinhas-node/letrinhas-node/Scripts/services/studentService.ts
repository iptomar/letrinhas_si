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
 * Devolve uma lista de alunos, juntamente com o nome da escola respectiva.
 * @author luisfmoliveira (Lu�s Oliveira)
 */
export function studentDetails(schoolId?: number): Q.Promise<Array<any>> {
    var sql = "select b.id, b.name, b.photoUrl, b.isActive, a.schoolName, c.classLevel, c.className, c.classYear from Schools as a, Students as b, Classes as c where b.classId = c.id and c.schoolId = a.id";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND c.schoolId = ?', [schoolId]);
    }

    return poolQuery(sql)
        .then((results) => results[0]);
}


/**
 * Devolve uma lista de alunos de uma turma, juntamente com o nome da escola respectiva.
 * @author luisfmoliveira (Lu�s Oliveira)
 */
export function studentDetailsEdit(schoolId?: number, classId?:number): Q.Promise<Array<any>> {
    var sql = "select s.id as idEscola, s.schoolName, c.id as idTurma, c.classLevel, c.className, c.classYear, st.id as idAluno, st.classId, st.isActive, st.name from Schools as s, Classes as c, Students as st where s.id = c.schoolId";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND c.schoolId = ? AND b.classID = ?', [schoolId,classId]);
    }

    return poolQuery(sql)
        .then((results) => results[0]);
}