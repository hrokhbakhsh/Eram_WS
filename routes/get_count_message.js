var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;

    var qryStr = "DECLARE @MembershipFilesID uniqueidentifier  " +
        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles " +
        "WHERE Person = \'%s\'); " +
        "SELECT  COUNT(*) count " +
        "FROM [app].[SendMessage] " +
        "WHERE MemberShipFileID = @MembershipFilesID "+
        "AND seened = 0";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PersonID), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "count": recordset.recordset[0].count});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;
