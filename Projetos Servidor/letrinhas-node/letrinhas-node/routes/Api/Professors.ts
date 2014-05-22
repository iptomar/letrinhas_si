import express = require('express');

import service = require('../../Scripts/services/professorService');
import Professor = require('../../Scripts/structures/schools/Professor');
import schoolService = require('../../Scripts/services/schoolService');

export function mapRoutes(app: express.Express) {

    app.get('/Api/Professors/All', function (req, res) {
        service.all()
            .then((professors) => res.json(professors))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.get('/Api/Professors/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) { res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((professor) => {
                if (professor === null) { return res.status(404).json({ error: 404 }); }

                res.json(professor);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });
}