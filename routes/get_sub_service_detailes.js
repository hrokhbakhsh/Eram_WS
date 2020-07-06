var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var MembershipFile = req.body.membership_file_id;
    var ServiceID = req.body.service_id;

    var qryExtended = " ";
    var qrySort = " ";

    var qryStr = "SELECT  " +
        "ReceptionDate, " +
        "UsedSessionsCount, " +
        "RemainedSessionsCount " +
        "FROM dbo.GetSubServiceDetailes ( \'%s\' , \'%s\')";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, MembershipFile, ServiceID), function (err, recordset) {

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