/*
 * Routes related to classes.
 */

import express = require('express');
import pool = require('../configs/mysql');
import Q = require('q');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Class = require('../Scripts/structures/schools/Class');


// GET: /Classes/
export function listAll(req: express.Request, res: express.Response) {
    poolQuery('SELECT * FROM Classes')
        .then((classes) => res.json(classes[0]))
        .catch((err) => res.status(500).end({ error: 500 }));
}

// GET: /Classes/:id/Students/
export function students(req: express.Request, res: express.Response) {
    res.end('/Classes/:id/Students');
}

// GET: /Classes/Create/
export function create(req: express.Request, res: express.Response) {
    res.end('/Classes/Create');
}

// GET: /Classes/:id/
export function details(req: express.Request, res: express.Response) {
    res.end('/Classes/:id');
}

// GET: /Classes/Relationships/
export function classRelationships(req: express.Request, res: express.Response) {
    poolQuery('SELECT * FROM ProfessorClass')
        .then((relation) => res.json(relation[0]))
        .catch((err) => res.status(500).json({ error: 500 }))
}