var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;
    var ReservableServiceID = req.body.reservable_service_id;
    var ReserveDate = req.body.reserve_date;
    var ReserveShamsiDate = req.body.reserve_shamsi_date;

    var qryStr =
    "DECLARE @MemberID  UNIQUEIDENTIFIER; " +
    "SELECT TOP 1 @MemberID =ID FROM krf_MembershipFiles WHERE Person = \'%s\'; " +
    "INSERT INTO krf_ServiceReserveRequests " +
    "    (ID " +
    "    ,CreationTime " +
    "    ,ReservableServices " +
    "    ,MembershipFile " +
    "    ,ReserveDate " +
    "    ,ReserveDateShamsi " +
    "    ,Called) " +
    "VALUES " +
    "    (NEWID() " +
    "    ,GETDATE() " +
    "    ,\'%s\' " +
    "    ,@MemberID " +
    "    ,\'%s\' " +
    "    ,\'%s\' " +
    "    ,0) ";

    qryStr = util.format(qryStr, PersonID, ReservableServiceID, ReserveDate, ReserveShamsiDate);


    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(qryStr, function (err, recordset) {

            if (err) {
                res.send({"Result": false, "ResultMessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({"Result": true, "ResultMessage": ""});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;