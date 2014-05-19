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
    var sql = mysql.format("Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(?,?,?,?)", [s.classId, s.name, filePath]);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}