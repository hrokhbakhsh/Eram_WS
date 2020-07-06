var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;
    var ShamsiDate = req.body.shamsi_date;
    var FilterType = req.body.filter_type;
    var SortType = req.body.sort_type;
    var SortAsced = req.body.sort_asced;

    var qryExtended = " ";
    var qrySort = " ";

    var qryStr = "DECLARE @MembershipFilesID uniqueidentifier  " +
        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles " +
        "WHERE Person = \'%s\'); " +
        "SELECT  ID, " +
        "ServiceID, " +
        "MembershipFileID, " +
        "ServiceTitle, " +
        "ServiceType_Text , " +
        "RegistrationSerial, " +
        "[ExpireDate], " +
        "ISNULL(RegisterationUsedSessionsCount, 0) AS RegisterationUsedSessionsCount, " +
        "ISNULL(RegisterationRemainedSessionsCount, 0) AS RegisterationRemainedSessionsCount, " +
        "ISNULL(CreditChargeUsedAmount, 0) AS CreditChargeUsedAmount, " +
        "ISNULL(CreditChargeRemainedAmount, 0) AS CreditChargeRemainedAmount, " +
        "ServiceTotalAmount,  " +
		"CASE " +
        "  WHEN RegistreationStatusName = 'Certain' THEN 1 " +
        "   ELSE 0 " +
        "END AS IsValid " +
        "FROM [dbo].[krf_TotalServicesSumOnePerson](@MembershipFilesID) ";

 switch (FilterType) {
        case 1:
            qryExtended = util.format(" WHERE ([ExpireDate] < \'%s\' ) OR ", ShamsiDate);
            qryExtended = qryExtended + "(((ServiceType_Text = N'شارژ اعتباری') AND (CreditChargeRemainedAmount <= 0)) OR " +
                "                         ((ServiceType_Text <> N'شارژ اعتباری') AND (RegisterationRemainedSessionsCount <= 0)) )";
            break;
        case 2:
            qryExtended = util.format(" WHERE ([ExpireDate] >= \'%s\' ) AND ", ShamsiDate);
            qryExtended = qryExtended + "(((ServiceType_Text = N'شارژ اعتباری') AND (CreditChargeRemainedAmount > 0)) OR " +
                "                         ((ServiceType_Text <> N'شارژ اعتباری') AND (RegisterationRemainedSessionsCount > 0)) )";
            break;
    }
    qryStr = qryStr + qryExtended;

    switch (SortType) {
        case 0:
            qrySort = "ORDER BY [ExpireDate] ASC ";
            if (!SortAsced) {
                qrySort = "ORDER BY [ExpireDate] DESC";
            }
            break;
        case 1:
            qrySort = "ORDER BY (RegisterationRemainedSessionsCount) ASC ";
            if (!SortAsced) {
                qrySort = "ORDER BY (RegisterationRemainedSessionsCount) DESC";
            }
            break;
        case 2:
            qrySort = "ORDER BY (RegisterationUsedSessionsCount) ASC ";
            if (!SortAsced) {
                qrySort = "ORDER BY (RegisterationUsedSessionsCount) DESC";
            }
            break;
    }

    qryStr = qryStr + qrySort;

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
                res.send({status: true, "errmessage": "", "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;



