/**
 * Created by cmos on 21/02/2018.
 */
var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;

    var qryString =
        "Declare @EvaluationID NUMERIC(18, 0), " +
        "        @MessagesCount Int, " +
        "        @UsedDate VARCHAR(12), " +
        "        @UsedTime VARCHAR(12), " +
        "        @MembershipFilesID uniqueidentifier; " +

        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles  " +
        "                          WHERE Person = \'%s\'); " +

        "SET @MessagesCount = (SELECT COUNT(ID) FROM app.SendMessage WHERE  " +
        "                      MembershipFileID = @MembershipFilesID AND Seened = 0); " +

        "SET @EvaluationID = (SELECT TOP 1[ID] " +
        "FROM [AppFrameworkEramDB].[app].[Evaluation] " +
        "WHERE MembershipFileID = @MembershipFilesID AND " +
        "      CreatedDate > DATEADD(day,-10,getdate()) AND ((Rate1 IS NULL) or (Rate2 IS NULL)) " +
        "Order By CreatedDate Desc); " +

        "DELETE FROM [AppFrameworkEramDB].[app].[Evaluation] " +
        "WHERE MembershipFileID = @MembershipFilesID AND ((Rate1 IS NULL) or (Rate2 IS NULL)) AND " +
        "      ID <> @EvaluationID; " +

        "SELECT TOP 1 @UsedDate = UsedDate, @UsedTime = UsedTime " +
        "FROM [AppFrameworkEramDB].[app].[Evaluation] WHERE ID = @EvaluationID; " +

        "SELECT ISNULL(@UsedDate, '') UsedDate, ISNULL(@UsedTime, '') UsedTime, @MessagesCount  MessagesCount ;";


    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, PersonID), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBUsedDate = recordset.recordset[0].UsedDate.toString();
                var DBUsedTime = recordset.recordset[0].UsedTime.toString();
                var DBMessagesCount = recordset.recordset[0].MessagesCount.toString();
                res.send({status: true, "UsedDate": DBUsedDate, "UsedTime":DBUsedTime, "MessagesCount": DBMessagesCount});
                sql.close();
                res.end();
                return;
            }
            else {
                res.send({status: false, "UsedDate":"", "UsedTime":"", "MessagesCount": 0});
                sql.close();
                res.end();
                return;

            }
        });
    });

});
module.exports = router;