/// <reference path="../typings/node/node.d.ts" />

// import mysql = require('../../configs/mysql');
import fs = require('fs');
import Q = require('q');

import pool = require('../../configs/mysql');
import mysqlAsync = require('../utils/promiseBasedMySql');

import TestSummary = require('../structures/tests/TestSummary');
import Test = require('../structures/tests/Test');
import ReadingTest = require('../structures/tests/ReadingTest');
import MultimediaTest = require('../structures/tests/MultimediaTest');


export function getBinaryData(onResult: (err: Error, result: NodeBuffer) => void) {
    //mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 2', (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        onResult(null, rows[0].binarydata);
    //    }
    //});

    fs.readFile('D:/z4.png', onResult);
}

/**
 * Returns a list of tests which were created after a set date.
 */
export function getTestsNewerThan(date: string): Q.Promise<Array<Test>> {

    var deferred = Q.defer<Array<Test>>();

    var tests = new Array<Test>();

    // Get the reading tests...
    mysqlAsync.selectQuery('SELECT * FROM ReadingTests WHERE creationDate > ' + date)
        .then((readingTests) => {
            var tests: Array<Test> = readingTests.rows;
            var i;

            for (i = 0; i < tests.length; i++) {
                // Populate the reading tests...
            }
        })
    // Get the multimedia tests...
        .then(() => mysqlAsync.selectQuery('SELECT * FROM Tests WHERE creationDate > ' + date + '  JOIN ....'))
        .then((multimediaTests) => {
            // Populate the multimedia tests...
        })
    // All went well.
        .then(() => deferred.resolve(tests))
    // Something went wrong.
        .fail((err) => {
            deferred.reject(err);
        });

    return deferred.promise;
}

export function getTestById(idList: number[], onResult: (err: Error, result: Array<any>) => void) {
    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysqlAsync.selectQuery(sql)
        .then((result) => {
            var rows = result.rows;

            var data = [];

            for (var i = 0; i < rows.length; i++) {
                data.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    textContent: rows[i].textContent,
                    professorName: rows[i].professorName,
                    maxTries: rows[i].maxTries,
                });
            }

            onResult(null, data);
        })
        .catch((err) => {
            onResult(err, null);
        });

    //pool.query(sql, (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {

    //        var result = [];

    //        for (var i = 0; i < rows.length; i++) {
    //            result.push({
    //                id: rows[i].id,
    //                title: rows[i].title,
    //                textContent: rows[i].textContent,
    //                professorName: rows[i].professorName,
    //                maxTries: rows[i].maxTries,
    //            });
    //        }

    //        onResult(null, result);
    //    }
    //});
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

            for (var i = 0; i < rows.length; i++) {
                testList.push(<TestSummary>{
                    id: rows[i].id,
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}


export function getAllRandomTests(num: number, year: number, area: String, onResult: (err: Error, result: Array<any>) => void) {
    //realiza a query
    mysql.pool.query("SELECT * from tbl_EscolhaMultipla where area ='" + area + "' and ano='" + year + "';", (err, rows, fields) => {
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