/*
* Routes related to tests.
*/
var pool = require('../configs/mysql');
var Q = require('q');

var poolQuery = Q.nbind(pool.query, pool);

var TestType = require('../Scripts/structures/tests/TestType');

// GET: /Tests/All/
// Params:
// -ofType=[0, 1, 2, 3]
// -areaId
// -grade
// -professorId
// -creationDate
function all(ofType, options) {
    var parameters = [];

    if (typeof options.areaId !== 'undefined') {
        parameters.push({ name: 'areaId', value: options.areaId });
    }
    if (typeof options.grade !== 'undefined') {
        parameters.push({ name: 'grade', value: options.grade });
    }
    if (typeof options.professorId !== 'undefined') {
        parameters.push({ name: 'professorId', value: options.professorId });
    }

    // Build the sql query.
    var where = 'WHERE t.type = ' + ofType;

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    if (options.creationDate) {
        where += ' AND t.creationDate > ' + options.creationDate;
    }

    switch (ofType) {
        case 0 /* read */:

        case 2 /* list */:

        case 3 /* poem */:
            return poolQuery('select t.id, t.type, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
        case 1 /* multimedia */:
            return poolQuery('SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
            break;
        default:
            return Q.reject('Unknown test type.');
    }
}
exports.all = all;

// GET: /Tests/Details/:id
function details(id) {
    return poolQuery({ sql: 'CALL getTestById(?)', nestTables: false }, id).then(function (result) {
        // Return a 404 if no tests were found.
        if (result[0][0].length === 0) {
            return Q.resolve(null);
        }

        // Return a single test.
        return Q.resolve(result[0][0][0]);
    });
}
exports.details = details;

// GET: /Tests/Create/
function createGet() {
    throw 'NYI';
}
exports.createGet = createGet;

// POST: /Tests/Create/
function createPost(t) {
    throw 'NYI';
}
exports.createPost = createPost;

// GET + POST: /Tests/Edit/:id
function edit() {
    throw 'NYI';
}
exports.edit = edit;

// POST: /Tests/Submit/:id
function submitResult(tc, filePath) {
    var args = [
        tc.testId,
        tc.studentId,
        tc.executionDate
    ];

    switch (tc.type) {
        case 0 /* read */:

        case 2 /* list */:

        case 3 /* poem */:
            var rtc = tc;

            args.concat([
                rtc.professorObservations,
                rtc.wordsPerMinute,
                rtc.correctWordCount,
                rtc.readingPrecision,
                rtc.readingSpeed,
                rtc.expressiveness,
                rtc.rhythm,
                rtc.details,
                rtc.wasCorrected
            ]);

            break;
        case 1 /* multimedia */:
            break;
        default:
            return Q.reject('Unknown type.');
    }

    throw 'NYI';
}
exports.submitResult = submitResult;
//# sourceMappingURL=Tests2.js.map
