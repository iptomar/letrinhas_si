var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');

var poolQuery = Q.nbind(pool.query, pool);

var service = require('../../Scripts/services/professorService');

var schoolService = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/BackOffice/Professors/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
        }

        // Obtemos as turmas (opcionalmente para uma turma)...
        service.professorDetails(options.schoolId).then(function (professorData) {
            res.render('professorList', {
                title: 'Lista de Professores' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + professorData[0].schoolName : ''),
                items: professorData
            });
        }).catch(function (err) {
            console.error(err);

            // TODO: Uma view de 500.
            res.status(500).render('Erros/500');
        });
    });

    app.all('/BackOffice/Professors/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                var schoolList, classList;

                var sqlClasses = 'select c.id, c.classLevel, c.className, c.schoolId, ' + 'c.classYear, s.schoolName ' + 'from Classes as c ' + 'join Schools as s on s.id = c.schoolId';

                var sqlSchools = 'select id, schoolName from Schools;';

                return poolQuery(sqlClasses).then(function (result) {
                    return classList = result[0];
                }).then(function (_) {
                    return poolQuery(sqlSchools);
                }).then(function (result) {
                    return schoolList = result[0];
                }).then(function (_) {
                    return res.render('addTeacher', {
                        title: 'Adicionar Professor',
                        schoolList: schoolList,
                        classList: classList
                    });
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });

            case 'POST':
                var body = req.body;
                var professor = {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    classIds: properlyHandleMultipleIds(body.classIds)
                };

                console.log(professor);

                service.createProfessor(professor, req.files.photo.path).then(function (_) {
                    return res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });
                break;
            default:
                res.status(404).render('Erros/404');
        }
    });

    app.get('/BackOffice/Professors/Choose', function (req, res) {
        return res.render('professorChoose');
    });

    app.get('/Professors/bySchool', function (req, res) {
        schoolService.getId(function (err, result) {
            res.render('professorBySchool', {
                title: 'Letrinhas',
                items: result
            });
        });
    });

    app.all('/BackOffice/Professors/Edit/:id', function (req, res) {
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);

                // Verificar se temos um id de professor válido.
                if (!isNaN(req.params.id)) {
                    options.professorId = parseInt(req.params.id, 10);
                } else {
                    return res.status(400).render('Erros/400');
                }

                var professorDetails;
                var schoolList, classList;

                var sqlProfessor = mysql.format('SELECT * FROM Professors WHERE id = ?', [options.professorId]);
                var sqlSchools = 'SELECT id, schoolName FROM Schools';
                var sqlClasses = 'SELECT c.id, c.classLevel, c.classYear, c.className, ' + 'if ((select count(*) from ProfessorClass as pc where pc.classId = c.id and pc.professorId = ?) > 0, 1, 0) as isInClass ' + 'from Classes as c;';

                sqlClasses = mysql.format(sqlClasses, options.professorId);

                return poolQuery(sqlProfessor).then(function (profResults) {
                    professorDetails = profResults[0][0];
                    return poolQuery(sqlSchools);
                }).then(function (schoolResults) {
                    schoolList = schoolResults[0];
                    return poolQuery(sqlClasses);
                }).then(function (classResults) {
                    return res.render('editTeacher', {
                        title: 'Editar professor ' + professorDetails.name,
                        data: professorDetails,
                        schoolList: schoolList,
                        classList: classResults[0]
                    });
                }).catch(function (err) {
                    console.error(err);
                    return res.status(500).render('Erros/500');
                });

            case 'POST':
                var body = req.body;

                var professor = {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    id: body.id,
                    isActive: body.state_filter,
                    classIds: properlyHandleMultipleIds(body.classIds)
                };

                service.editProfessor(professor).then(function (_) {
                    return res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });
                break;
        }
    });
}
exports.mapRoutes = mapRoutes;

/**
* This function unravels the mess that is the id list
* when more than 2 fields come.
*
* For some reason, the parser, for values 1, 3 and 9, for example,
* does: [[1, 3], 9].
*
* This takes that array and linearizes it, like this: [1, 3, 9].
*
* @author redroserade
*/
function properlyHandleMultipleIds(idList, dst) {
    if (typeof dst === "undefined") { dst = []; }
    for (var i = 0; i < idList.length; i++) {
        if (isNaN(idList[i])) {
            // dst = dst.concat(properlyHandleMultipleIds(idList[i], dst));
            properlyHandleMultipleIds(idList[i], dst);
        } else if (dst.indexOf(idList[i]) === -1) {
            dst.push(idList[i]);
        }
    }

    // console.log(dst);
    return dst;
}
//# sourceMappingURL=Professors.js.map
