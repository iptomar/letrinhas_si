import pool = require('../../configs/mysql');
import mysqlAsync = require('../utils/promiseBasedMySql');

import Professor = require('../structures/schools/Professor');
import Class = require('../structures/schools/Class');
import ProfessorClass = require('../structures/schools/ProfessorClass');
import School = require('../structures/schools/School');
import Student = require('../structures/schools/Student');

/**
 * Gets the list of schools from the db.
 */
export function getSchools(onDone: (err: Error, data: Array<School>) => void) {

    mysqlAsync.selectQuery('SELECT * FROM Schools')
        .then((result) => {
            var rows = result.rows;

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
        })
        .catch((err) => {
            onDone(err, null);
        });
}

/**
 * Gets a list of professors which are currently active.
 */
export function getProfessors(onDone: (err: Error, data: Array<Professor>) => void) {
    pool.query('SELECT * FROM Professors WHERE isActive = 1', (err, rows: Array<Professor>, fields) => {
        if (err) {
            return onDone(err, null);
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
            };
        }

        onDone(null, professors);
    });
}

/**
 * Gets a list of classes for the current year.
 */

/**
 * Gets a list of students which are currently active.
 */
export function getStudents(onDone: (err: Error, data: Array<Student>) => void) {
    pool.query('SELECT * FROM Students WHERE isActive = true', (err, rows: Array<Student>, fields) => {
        if (err) {
            return onDone(err, null);
        }

        var students = new Array<Student>(rows.length);

        for (var i = 0; i < rows.length; i++) {
            students[i] = <Student> {
                id: rows[i].id,
                classId: rows[i].classId,
                isActive: rows[i].isActive,
                name: rows[i].name,
                photoUrl: rows[i].photoUrl
            };
        }

        onDone(null, students);
    });
}

/**
 * Gets a list of relationships between professors and classes,
 * for the current year.
 */
export function getProfessorsForClasses(onDone: (err: Error, data: Array<ProfessorClass>) => void) {
    pool.query('SELECT * FROM ProfessorClass', (err, rows: Array<ProfessorClass>, fields) => {
        if (err) {
            return onDone(err, null);
        }

        var professorClasses = new Array<ProfessorClass>(rows.length);

        for (var i = 0; i < rows.length; i++) {
            professorClasses[i] = <ProfessorClass> {
                classId: rows[i].classId,
                professorId: rows[i].professorId
            };
        }

        onDone(null, professorClasses);
    });
}