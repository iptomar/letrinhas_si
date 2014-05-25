import express = require('express');

import service = require('../../Scripts/services/studentService');
import Student = require('../../Scripts/structures/schools/Student');

export function mapRoutes(app: express.Express) {
    app.get('/Api/Students/All', function (req, res) {
        service.all()
            .then((students) => res.json(students))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    console.log('GET /Students/All ->', service.all.toString());

    app.get('/Api/Students/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) { res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((student) => {
                if (student === null) { return res.status(404).json({ error: 404 }); }

                res.json(student);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    console.log('GET /Students/All ->', 'service.details');
}