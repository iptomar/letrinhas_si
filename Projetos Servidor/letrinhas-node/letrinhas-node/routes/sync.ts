import syncServices = require('../Scripts/services/syncServices');
import express = require('express');

/**
 * Gets all the professors from the DB, and sends them
 * down the request.
 * 
 * If an error happens, the list will be empty and a 500 is sent.
 */
export function getProfessors(request: express.Request, response: express.Response) {
    syncServices.getProfessors((err, professors) => {
        if (err) {
            response.statusCode = 500;
            response.json({
                professors: []
            });
            return;
        }

        response.json({
            professors: professors
        });
    });
}

/**
 * Gets all the schools from the DB, and sends them down the request.
 * 
 * If an error happens, the list will be empty and a 500 is sent.
 */
export function getSchools(request: express.Request, response: express.Response) {
    syncServices.getSchools((err, schools) => {
        if (err) {
            response.statusCode = 500;

            response.json({
                schools: []
            });
            return;
        }

        response.json({
            schools: schools
        });
    });
}

export function getStudents(request: express.Request, response: express.Response) {
    syncServices.getStudents((err, students) => {
        if (err) {
            response.statusCode = 500;

            response.json({
                students: []
            });
            return;
        }

        response.json({
            students: students
        });
    });
}

export function getProfessorClasses(request: express.Request, response: express.Response) {
    syncServices.getProfessorsForClasses((err, professorClasses) => {
        if (err) {
            response.statusCode = 500;

            response.json({
                professorClasses: []
            });
            return;
        }

        response.json({
            professorClasses: professorClasses
        });
    });
}