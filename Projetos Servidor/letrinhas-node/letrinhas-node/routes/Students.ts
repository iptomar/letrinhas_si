/*
 * Routes related to students.
 */
import express = require('express');
import pool = require('../configs/mysql');
import Q = require('q');
import mysql = require('mysql');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Student = require('../Scripts/structures/schools/Student');

// GET: /Students/All/
export function all(req: express.Request, res: express.Response) {
    poolQuery('SELECT * FROM Students')
        .then((students) => res.json(students[0]))
        .catch((err) => res.status(500).end({ error: 500 }));
}

// GET: /Students/Details/:id
export function details(req: express.Request, res: express.Response) {
    poolQuery(mysql.format('SELECT * FROM Students WHERE id = ?', [req.params.id]))
        .then((students) => res.json(students[0][0]))
        .catch((err) => res.status(500).end({ error: 500 }));
}

// GET + POST: /Students/Create/
export function create(req: express.Request, res: express.Response) {
    switch (req.method) {
        case 'GET':
            break;
        case 'POST':
            break;
        default:
            break;
    }
}

// GET + POST: /Students/Edit/:id
export function edit(req: express.Request, res: express.Response) {
    switch (req.method) {
        case 'GET':
            break;
        case 'POST':
            break;
        default:
            break;
    }
}