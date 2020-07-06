var express = require('express');
var router = express.Router();
var rn = require('random-number');
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

    var MembershipFileID = req.body.membershipfile_id;
    var UsedDate = req.body.used_date;
    var UsedTime = req.body.used_time;
    var ServiceID = req.body.service_id;
    var ServiceTypeID = req.body.service_type_id;

    var FirstUsedDate = UsedDate.substring(0, 2);
    Status = (FirstUsedDate === "13" || UsedDate.toString().length === 10)
    if (!Status) {
        res.send({status: Status, "errmessage": "فرمت تاریخ ارسالی صحیح نیست"});
        res.end();
        return;
    }

    Status = (UsedTime.toString().length === 8)
    if (!Status) {
        res.send({status: Status, "errmessage": "فرمت ساعت ارسالی صحیح نیست"});
        res.end();
        return;
    }

    var qryString =
        "INSERT INTO [app].[Evaluation] (MembershipFileID, UsedDate, UsedTime, CreatedDate, ServiceID, ServiceTypeID) " +
        "VALUES (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\') ";

    var qryGetToken =
        "SELECT TOP (1) ISNULL(TokenKey, 0) AS TokenKey, ISNULL(DeviceType, 1) AS DeviceType FROM krf_MembershipFiles AS p " +
        "LEFT JOIN [app].[MobileDeviceInfo] AS t ON (t.PersonID = p.Person) " +
        "WHERE p.ID = \'%s\' ORDER BY (t.ModifiedDateTime) DESC";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryString, MembershipFileID, UsedDate, UsedTime, formatted, ServiceID, ServiceTypeID), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                request.query(util.format(qryGetToken, MembershipFileID), function (err, recordset) {

                    if (err) {
                        res.send({status: false, "errmessage": err});
                        sql.close();
                        res.end();
                        return;
                    }
                    if (recordset.recordset.length > 0) {
                        var TokenKey = recordset.recordset[0].TokenKey.toString();
                        var DeviceType = recordset.recordset[0].DeviceType.toString();
                        shared.SendEvaluationNotify(TokenKey, UsedDate, DeviceType);
                        res.send({status: true, "errmessage": ""});
                        sql.close();
                        res.end();
                        return;
                    }
                });
            }
        });
    });
});
module.exports = router;