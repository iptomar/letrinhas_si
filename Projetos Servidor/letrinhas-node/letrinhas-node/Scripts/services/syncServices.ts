import pool = require('../../configs/mysql');

import Professor = require('../structures/schoolDataStructures/professor');
import Class = require('../structures/schoolDataStructures/class');
import ProfessorClass = require('../structures/schoolDataStructures/professorClass');
import School = require('../structures/schoolDataStructures/school');
import Student = require('../structures/schoolDataStructures/student');

/**
 * Gets the list of schools from the db.
 */
export function getSchools(onDone: (err: Error, data: Array<School>) => void) {
    // Get the schools.
    pool.query('SELECT * FROM Schools', (err, rows: Array<School>, fields) => {

        if (err) {
            return onDone(err, null);
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
export function getClasses(onDone: (err: Error, data: Array<Class>) => void) {
    pool.query('SELECT * FROM Classes', (err, rows: Array<Class>, fields) => {
        if (err) {
            return onDone(err, null);
        }

        var classes = new Array<Class>(rows.length);

        for (var i = 0; i < rows.length; i++) {
            classes[i] = <Class> {
                id: rows[i].id,
                schoolId: rows[i].schoolId,
                classLevel: rows[i].classLevel,
                className: rows[i].className,
                classYear: rows[i].classYear
            };
        }

        onDone(null, classes);
    });
}

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
            }
        }

        onDone(null, students);
    });
}
