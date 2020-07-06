var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');
var dateTime = require('node-datetime');

router.post('/', function (req, res, next) {

    var nowDate;
    var formattedTime;
    var formattedDate;
    // var PersonId = req.body.person_id;
    var Message = req.body.message;
    var Title = req.body.title;
    var PhoneNumbers = req.body.phones;
    nowDate = dateTime.create();
    formattedDate = nowDate.format('Y-m-d');
    formattedTime = nowDate.format('H:M:S');


    var qryString = "SELECT m.id FROM krf_MembershipFiles AS m " +
        "LEFT JOIN cmn_Persons AS p ON(p.id = m.Person) " +
        "LEFT JOIN app.MobileDeviceInfo AS d ON(d.PhoneNumber = p.MobilePhoneNumber1) " +
        "WHERE d.PhoneNumber IN ( %s ) ";

    sql.connect(db, function (err) {
        if (err) {
            res.send({
                status: false, "errmessage": err
            });
            res.end();
            return;
        }

        var request = new sql.Request();
        request.query(util.format(qryString, PhoneNumbers), function (err, qryStringrecordset) {
            if (err) {
                console.log(err);
                res.send({
                    status: false, "errmessage": err
                });
                sql.close();
                res.end();
                return;
            }
            var valueString;
            for (var j = 0; j < qryStringrecordset.recordset.length; j++) {
                if (j === 0)
                    valueString = "(\'" + qryStringrecordset.recordset[j].id + "'\, \'" + formattedDate + "\', \'" + formattedTime + "\', N\'" + Title + "\', N\'" + Message + "\'"+", 0, '', '') ";
                else
                    valueString = valueString + ", " +
                                  "(\'" + qryStringrecordset.recordset[j].id + "'\, \'" + formattedDate + "\', \'" + formattedTime + "\', N\'" + Title + "\', N\'" + Message + "\'"+", 0, '', '') ";
            }
            var qryString2 =
                "INSERT INTO [app].[SendMessage] " +
                "VALUES " + valueString;

            var request = new sql.Request();
            request.query(qryString2, function (err, qryString2recordset) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: false, "errmessage": err
                    });
                    sql.close();
                    res.end();
                    return;
                }

                var qryStr =
                    "SELECT PhoneNumber, ISNULL(DeviceType, 1) AS DeviceType, TokenKey  FROM app.MobileDeviceInfo " +
                    "WHERE ID IN (SELECT max(ID) AS ID FROM app.MobileDeviceInfo GROUP BY PhoneNumber, DeviceType) " +
                    "AND PhoneNumber in (" + PhoneNumbers + ") " +
                    "AND  (ModifiedDateTime IN (SELECT max(ModifiedDateTime) AS ModifiedDateTime FROM app.MobileDeviceInfo GROUP BY PhoneNumber)  OR (ModifiedDateTime IS NULL)) ";

                request.query(qryStr, function (err, qryStrrecordset) {

                    if (err) {
                        res.send({status: false, "errmessage": err});
                        sql.close();
                        res.end();
                        return;
                    }

                    if (qryStrrecordset.recordset.length > 0) {
                        shared.SendMessageToManyUserNotify(qryStrrecordset.recordset, Message);
                        res.send({status: true, "errmessage": ""});
                        sql.close();
                        res.end();
                        return;
                    }
                });
            });
        });
    });
});
module.exports = router;