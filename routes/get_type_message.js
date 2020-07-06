var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.get('/', function (req, res, next) {
    sql.connect(db , function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query('SELECT ID, Name, Activated FROM app.MessageCategory  WHERE Activated = 1 ', function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send(recordset.recordset);
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;