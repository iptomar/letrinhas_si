/*
* Routes related to classes.
*/
var pool = require('../configs/mysql');
var Q = require('q');

var poolQuery = Q.nbind(pool.query, pool);

// GET: /Classes/
function listAll(req, res) {
    poolQuery('SELECT * FROM Classes').then(function (classes) {
        return res.json(classes[0]);
    }).catch(function (err) {
        return res.status(500).end({ error: 500 });
    });
}
exports.listAll = listAll;

// GET: /Classes/:id/Students/
function students(req, res) {
    res.end('/Classes/:id/Students');
}
exports.students = students;

// GET: /Classes/Create/
function create(req, res) {
    res.end('/Classes/Create');
}
exports.create = create;

// GET: /Classes/:id/
function details(req, res) {
    res.end('/Classes/:id');
}
exports.details = details;

// GET: /Classes/Relationships/
function classRelationships(req, res) {
    poolQuery('SELECT * FROM ProfessorClass').then(function (relation) {
        return res.json(relation[0]);
    }).catch(function (err) {
        return res.status(500).json({ error: 500 });
    });
}
exports.classRelationships = classRelationships;
//# sourceMappingURL=Classes.js.map
