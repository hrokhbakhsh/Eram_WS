/**
 * Created by cmos on 21/02/2018.
 */
var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');

router.post('/', function (req, res, next) {

    var Filtered = req.body.filtered;

    var qryString = "SELECT ID, Name FROM afw_OrganizationUnits "


    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, Filtered), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
             if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "errmessage":"", "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;