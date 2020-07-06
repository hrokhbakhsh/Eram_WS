var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var MembershipFile = req.body.membership_file_id;

    var qryExtended = " ";
    var qrySort = " ";

    var qryStr = "SELECT  " +
        "CreationTime, " +
        "LockerNumber, " +
        "EnterTime, " +
        "ExitTime, " +
        "[Description], " +
        "ElapsedMinutes, " +
        "InputAmount, " +
        "TimeAmount, " +
        "SalesInvoiceAmount, " +
        "SubServiceAmount, " +
        "UsedCreditChargeTotalAmount, " +
        "CreditTotalAmount, " +
        "ChargeAmountNote " +
        "FROM dbo.GetCreditServiceDetailes (\'%s\')";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, MembershipFile), function (err, recordset) {

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