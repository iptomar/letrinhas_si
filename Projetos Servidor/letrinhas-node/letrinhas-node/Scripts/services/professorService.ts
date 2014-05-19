
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