/**
 * Created by cmos on 21/02/2018.
 */
var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');

router.post('/', function (req, res, next) {

    var FactorId = req.body.factor_id;

    var qryString =
        "SELECT ID, FactorID, ItemID, Name,Fee,NumberSelected,SumPrice " +
        "FROM [rst].[FactorDetails] " +
        "WHERE FactorID = %s ";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, FactorId), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;