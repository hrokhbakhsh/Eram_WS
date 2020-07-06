var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var FromDate = req.body.from_date;
    var ToDate = req.body.to_date;

    var qryExtended = " ";
    var qryStr =
        "SELECT TOP 500 " +
        "p.StoredDisplayText AS PersonName, " +
        "e.UsedDate, " +
        "e.UsedTime, " +
        "s.Title, " +
        "e.Rate1, " +
        "e.Rate2, " +
        "e.Description " +
        "FROM [AppFrameworkEramDB].[app].[Evaluation] AS e " +
        "LEFT JOIN krf_MembershipFiles AS m ON (e.MembershipFileID = m.ID) " +
        "LEFT JOIN cmn_Persons AS p ON (m.person = p.ID) " +
        "LEFT JOIN krf_Services AS s on (e.ServiceID = s.id AND s.ShowInSecondaryServices = 0) " +
        "WHERE " +
        "[ModifiyedDate] IS NOT NULL " +
        "AND (e.UsedDate >=  \'%s\') AND (e.UsedDate <  \'%s\') ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, FromDate, ToDate), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                res.send({status: true, "errmessage": "", "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
            else {
                res.send({status: false, "errmessage":"داده ای برای این محدوده زمانی وجود ندارد"});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;