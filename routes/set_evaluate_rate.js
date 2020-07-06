var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var nowDate;
var formatted;
var Status;

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    var PersonID = req.body.person_id;
    var Rate1 = req.body.rate_1;
    var Rate2 = req.body.rate_2;
    var Rate3 = req.body.rate_3;
    var Description = req.body.description;

    var qryExtended = " ";
    var qrySort = " ";

    var qryStr =
        "DECLARE @MembershipFilesID uniqueidentifier " +
        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles " +
        "WHERE Person = \'%s\'); " +
        "UPDATE [app].[Evaluation] " +
        "SET " +
        "ModifiyedDate = \'%s\', " +
        "Rate1 = %d, " +
        "Rate2 = %d, " +
        "Rate3 = %d, " +
        "[Description] = N\'%s\' " +
        "WHERE ID = (SELECT TOP 1 ID FROM [app].[Evaluation] " +
        "WHERE (MembershipFileID = @MembershipFilesID) AND " +
        "(Rate1 IS NULL) AND " +
        "(Rate2 IS NULL) AND " +
        "(Rate3 IS NULL) AND " +
        "([Description] IS NULL) " +
        "ORDER BY (CreatedDate) DESC) ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PersonID, formatted, Rate1, Rate2, Rate3, Description), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "errmessage": ""});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;