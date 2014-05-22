import express = require('express');

import service = require('../../Scripts/services/schoolService');
import School = require('../../Scripts/structures/schools/School');

export function mapRoutes(app: express.Express) {

    app.get('/Api/Schools/All', function (req, res) {
        service.all()
            .then((schools) => res.json(schools))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.get('/Api/Schools/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) { res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((school) => {
                if (school === null) { return res.status(404).json({ error: 404 }); }

                res.json(school);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });
}

