var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var OrganizationUnit = req.body.organization_unit;
    var ServiceID = req.body.charge_service_id

    var qryStr =
        "SELECT ISNULL(FromTime, '00:00')FromTime, " +
        "ISNULL(ToTime,'00:00')ToTime, " +
        "ISNULL(InputAmount, '0')InputAmount, " +
        "ISNULL(DayNo , 0) DayNo, " +
        "ISNULL(FromExtraTime, 0) FromExtraTime, " +
        "ISNULL(ExtraTimeAmount, 0) ExtraTimeAmount " +
        "FROM krf.FormulaFractionOfCharge(\'%s\', \'%s\') " +
        "ORDER BY DayNo, FromTime ";


    qryStr = util.format(qryStr, ServiceID, OrganizationUnit);


    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(qryStr, function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "errmessage": "", "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;