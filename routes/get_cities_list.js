var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.get('/', function (req, res, next) {
    sql.connect(db , function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query('SELECT TOP(1) * FROM cmn_Persons', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            sql.close();
        });
    });

});
module.exports = router;