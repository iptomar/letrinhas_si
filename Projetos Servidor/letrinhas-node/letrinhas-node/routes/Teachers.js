function mapRoutes(app) {
    switch (req.method) {
        case 'GET':
            return res.render('addTeacher');
        case 'POST':
            // TODO: Meter dados na BD.
            var body = req.body;
            var teacher = {
                schoolId: parseInt(body.schoolId),
                name: body.name,
                username: body.username,
                password: body.password,
                emailAddress: body.mail,
                telephoneNumber: body.phone,
                isActive: body.state_filter
            };

            appPostServices.addTeacher(teacher, req.files.photo.path, req.files.photo.originalname).then(function (_) {
                return res.end('Dados inseridos com sucesso!');
            }).catch(function (err) {
                return res.end('error: ' + err.toString());
            });
    }
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Teachers.js.map
