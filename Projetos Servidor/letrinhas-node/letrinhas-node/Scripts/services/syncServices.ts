/// <reference path="../typings/mysql/mysql.d.ts" />

'use strict';

import mysqlConfig = require('../../configs/mysql');

var pool = mysqlConfig.pool;

/**
 * Defines a professor in this app.
 */
export class Professor {
    id: number;
    /**
     * The ID of the school associated with this professor.
     */
    schoolId: number;
    /**
     * The name of this professor.
     */
    name: string;
    /**
     * The email address of this professor.
     */
    emailAddress: string;
    /**
     * The telephone number of this professor.
     */
    telephoneNumber: string;
    /**
     * Url for this professor's picture.
     */
    photoUrl: string;
    /**
     * True if this professor is active. False otherwise.
     *
     * 'Active' means that the professor is giving lectures
     * in this school year.
     */
    isActive: boolean;
    /**
     * The user name that will be used to authenticate this
     * user, both in back-office and in the tablet.
     */
    username: string;
    /**
     * The password that will be used to authenticate this
     * user, both in back-office and in the tablet.
     */
    password: string;
}

export class SchoolClass {
    classId: number;
    schoolId: number;
    classLevel: number;
    className: string;

    classYear: string;
}

export class ProfessorClassLecture {
    classId: number;
    professorId: number;
}

export class School {
    id: number;
    schoolName: string;
    schoolLogoUrl: string;
    schoolAddress: string;
}

export class Student {
    studentId: number;
    classId: number;

    name: string;

    photoUrl: string;

    isActive: boolean;
}


// Select statements.
/**
 * SELECT statmeent to obtain all schools.
 */
var SELECT_SCHOOLS = 'SELECT * FROM Schools';

/**
 * SELECT statmeent to obtain all schools.
 */
var SELECT_PROFESSORS = 'SELECT * FROM Professors';

export function getSchools(onDone: (err: Error, data: Array<School>) => void) {
    // Get the schools.
    pool.query(SELECT_SCHOOLS, (err, rows, fields) => {

        if (err) {
            return onDone(err, []);
        }

        var schools = new Array<School>(rows.length);

        for (var i = 0; i < rows.length; i++) {
            schools[i] = <School> {
                id: rows[i].id,
                schoolAddress: rows[i].schoolAddress,
                schoolLogoUrl: rows[i].schoolLogoUrl,
                schoolName: rows[i].schoolName
            };
        }

        onDone(null, schools);
    });
}

export function getProfessors(onDone: (err: Error, data: Array<Professor>) => void) {
    pool.query(SELECT_PROFESSORS, (err, rows, fields) => {
        if (err) {
            return onDone(err, []);
        }

        var professors = new Array<Professor>(rows.length);

        for (var i = 0; i < rows.length; i++) {
            professors[i] = <Professor> {
                id: rows[i].id,
                schoolId: rows[i].schoolId,
                name: rows[i].name,
                username: rows[i].username,
                password: rows[i].password,
                emailAddress: rows[i].emailAddress,
                telephoneNumber: rows[i].telephoneNumber,
                isActive: rows[i].isActive,
                photoUrl: rows[i].photoUrl
            }
        }

        onDone(err, professors);
    });
}