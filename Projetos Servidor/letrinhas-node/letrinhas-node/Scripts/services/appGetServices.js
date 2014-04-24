// import mysql = require('../../configs/mysql');
var fs = require('fs');

var mysql = require('../../configs/mysql');

function getBinaryData(onResult) {
    //mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 2', (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        onResult(null, rows[0].binarydata);
    //    }
    //});
    fs.readFile('D:/z4.png', onResult);
}
exports.getBinaryData = getBinaryData;

function getTestById(idList, onResult) {
    //var listResult = [];
    //for (var i = 0; i < idList.length; i++) {
    //    listResult.push({
    //        id: idList[i],
    //        title: 'Teste ' + i
    //    });
    //}
    //onResult(null, listResult);
    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysql.pool.query(sql, function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];

            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    textContent: rows[i].textContent,
                    professorName: rows[i].professorName,
                    maxTries: rows[i].maxTries
                });
            }

            onResult(null, result);
        }
    });
}
exports.getTestById = getTestById;

/**
* Gets tests from a database, and returns an array of TestSummary.
*
*/
function getTestListSummaryFromDb(max, onResult) {
    mysql.pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var testList = [];

            for (var i = 0; i < rows.length; i++) {
                testList.push({
                    id: rows[i].id,
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}
exports.getTestListSummaryFromDb = getTestListSummaryFromDb;

function getAllRandomTests(num, year, area, onResult) {
    //realiza a query
    mysql.pool.query("SELECT * from tbl_EscolhaMultipla where area ='" + area + "' and ano='" + year + "';", function (err, rows, fields) {
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
                        area: rows[i].area
                    });
                }
            } else {
                var aux = 0;

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
                            area: rows[rnd - 1].area
                        });
                    } else {
                        i = i - 1;
                    }
                }
            }

            onResult(null, result);
        }
    });
}
exports.getAllRandomTests = getAllRandomTests;
//# sourceMappingURL=appGetServices.js.map
