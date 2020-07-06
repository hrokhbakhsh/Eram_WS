var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');
var dateTime = require('node-datetime');

router.post('/', function (req, res, next) {

    var nowDate;
    var formattedTime;
    var formattedDate;
    var PersonId = req.body.person_id;
    var MessageCategoryId = req.body.message_category_id;
    var Message = req.body.message;
    nowDate = dateTime.create();
    formattedDate = nowDate.format('Y-m-d');
    formattedTime = nowDate.format('H:M:S');

    var qryString = "DECLARE @MembershipFilesID uniqueidentifier  " +
        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles " +
        "WHERE Person = \'%s\'); " +
        "INSERT INTO [app].[RecievedMessage] " +
        "VALUES (@MembershipFilesID, \'%s\', \'%s\', \'%s\', N\'%s\') " ;

    sql.connect(db, function (err) {
        if (err) {
            res.send({
                status: false, "errmessage": err
            });
            res.end();
            return;
        }

        var request = new sql.Request();
        request.query(util.format(qryString, PersonId, MessageCategoryId, formattedDate, formattedTime, Message), function (err, recordset) {
            if (err) {
                console.log(err);
                res.send({
                    status: false, "errmessage": err
                });
                sql.close();
                res.end();
                return;
            }

            // send records as a response
            if (recordset.rowsAffected.length > 0) {
                res.send({
                    status: true, "errmessage": ""
                });
                sql.close();
                res.end();
                return;
            }

        });
    });

});
module.exports = router;