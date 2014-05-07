/// <reference path="../typings/node/node.d.ts" />

import fs = require('fs');
import Q = require('q');

import pool = require('../../configs/mysql');

import TestSummary = require('../structures/tests/TestSummary');
import Test = require('../structures/tests/Test');
import ReadingTest = require('../structures/tests/ReadingTest');
import MultimediaTest = require('../structures/tests/MultimediaTest');
import TestType = require('../structures/tests/TestType');

var poolQuery = Q.nbind(pool.query, pool);

/**
 * Returns a list of tests which were created after a set date.
 */
export function getTestsNewerThan(timestamp: number): Q.Promise<Array<Test>> {
    // return Q.ninvoke(pool, "query", "SELECT id, professorId, title, mainText, unix_timestamp(creationDate) as creationDate, grade, type, areaId FROM Tests WHERE creationDate > from_unixtime(?)", timestamp)
    return poolQuery("SELECT id, professorId, title, mainText, unix_timestamp(creationDate) as creationDate, grade, type, areaId FROM Tests WHERE creationDate > from_unixtime(?)", timestamp)
        .then((result) => <Array<Test>> result[0]);
}

export function getTestById(id: number): Q.Promise<Test> {
    // Make use of stored procedures to clean up our code.
    // The reason is because we need to determine the test type.
    // It's much simpler to just use a stored procedure which
    // handles all the logic for us in there.
    var options = {
        sql: 'CALL getTestById(?)',
        nestTables: false
    };

    // return Q.ninvoke(pool, "query", options, id)
    return poolQuery(options, id)
        .then((result) => result[0][0].length === 0 ? null : result[0][0])
}

export function getTests(options: { type: number; areaId?: number; grade?: number; professorId?: number; creationDate?: number }): Q.Promise<Array<Test>> {

    if (typeof options.type === 'undefined') {
        return Q.reject(new Error('No parameteres supplied!'));
    }

    var parameters = [];
    if (options.areaId !== undefined) { parameters.push({ name: 'areaId', value: options.areaId }); }
    if (options.grade !== undefined) { parameters.push({ name: 'grade', value: options.grade }); }
    if (options.professorId !== undefined) { parameters.push({ name: 'professorId', value: options.professorId }); }

    // Build the sql query.
    var where = 'WHERE t.type = ' + options.type;

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    if (options.creationDate) {
        where += ' AND t.creationDate > from_unixtime(' + options.creationDate + ')';
    }

    switch (options.type) {
        case TestType.read:
            // return Q.ninvoke(pool, "query", 'select t.id, t.type, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where)
            return poolQuery('select t.id, t.type, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
        case TestType.multimedia:
            // return Q.ninvoke(pool, 'query', 'SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, t.grade, t.areaId, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where)
            return poolQuery('SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, t.grade, t.areaId, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
        default:
            return Q.reject('Invalid test type');
    }
}

/**
 * Gets tests from a database, and returns an array of TestSummary.
 * 
 */
export function getTestListSummaryFromDb(max: number, onResult: (err: Error, summaryList: TestSummary[]) => void) {
    pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            var testList: TestSummary[] = [];

            //for (var i = 0; i < rows.length; i++) {
            //    testList.push(<TestSummary>{
            //        id: rows[i].id,
            //        title: rows[i].title
            //    });
            //}

            onResult(null, testList);
        }
    });
}


export function getAllRandomTests(num: number, year: number, area: String, onResult: (err: Error, result: Array<any>) => void) {
    //realiza a query
    pool.query("SELECT * from tbl_EscolhaMultipla where area ='" + area + "' and ano='" + year + "';", (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            //Caso o numero de perguntas que o professor quer, sobre um tema, seja igual ou superior as que existem na BD, devolve todas. Pode-se alterar por uma 
            //mensagem de erro. Fica para se decidir
            if (num >= rows.length) {
                for (var i = 0; i <= rows.length; i++) {
                    result.push({
                        id: rows[i].id,
                        texto: rows[i].texto,
                        imagem1: rows[i].imagem1,
                        imagem2: rows[i].imagem2,
                        imagem3: rows[i].imagem3,
                        opcaoCorreta: rows[i].opcaoCorreta,
                        area: rows[i].area,
                    });

                }
            }
            else {
                var aux = 0;
                //vamos criar um teste de num perguntas random. Basicamente estou a ver quantos registos o select devolveu
                //Depois gero um numero random entre 1 e o numero de linhas
                //e devolve a pergunta que tiver o id que o random gerou (não sei se é a melhor forma...mas funciona)
                //a variavel aux é um "truque", que compara o random com o random anterior, para evitar que existam perguntas repetidas
                //caso o random seja igual ao anterior, o indice do ciclo for é "anulado", para se evitar que, imaginem 4 perguntas, 3 random eram iguais, então só ia ser devolvida uma pergunta
                //é capaz de ser confuso, sorry :S    
                for (var i = 1; i <= num; i++) {
                    var rnd = Math.floor((Math.random() * rows.length) + 1);
                    if (rnd != aux) {
                        aux = rnd;
                        result.push({
                            id: rows[rnd - 1].id,
                            texto: rows[rnd - 1].texto,
                            imagem1: rows[rnd - 1].imagem1,
                            imagem2: rows[rnd - 1].imagem2,
                            imagem3: rows[rnd - 1].imagem3,
                            opcaoCorreta: rows[rnd - 1].opcaoCorreta,
                            area: rows[rnd - 1].area,
                        });
                    }
                    else {
                        i = i - 1;
                    }
                }
            }

            onResult(null, result);
        }
    });

}