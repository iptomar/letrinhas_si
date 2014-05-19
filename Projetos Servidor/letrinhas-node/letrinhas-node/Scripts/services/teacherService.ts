import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import uuid = require('node-uuid');
import path = require('path');
import mv = require('mv');
import app = require('../../app');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Professor = require('../structures/schools/Professor');

export function createTeacher(p: Professor, uploadedFilePath: string): Q.Promise<any> {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/professors/' + uuid.v4()),
        fileName = path.join(filePath, 'professor' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, fileName.replace(/\\/g, '/')]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
        .then((_) => poolQuery(sql));
}