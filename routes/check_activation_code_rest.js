var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var nowDate;
var Validate;
var formatted;
var ExistUser;

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    var ActivationCode = req.body.activation_code;
    var Phone = req.body.phone;

    var qryStr = "SELECT t.ID " +
    ",ISNULL(t.PhoneNumber, '0') AS PhoneNumber " +
    ",ISNULL(u.PersonName, '0') AS  PersonName " +
    ",u.ID AS UserID " +
    ",s.name AS StoreName " +
    "FROM [rst].[Tmp_ActivationCode] AS t " +
    "LEFT JOIN [rst].Users AS u ON (t.UserID = u.ID) " +
    "LEFT JOIN [rst].Store AS s ON (u.StoreID = s.id) " +
    "WHERE " +
    "t.PhoneNumber = \'%s\' AND " +
    "ActivationCode = %s AND " +
    "Used = 0 AND " +
    "ExpirationDateTime >= \'%s\' AND " +
    "CreatedDateTime <= \'%s\'";

    var qryUpdate = "UPDATE [rst].[Tmp_ActivationCode] " +
        "SET Used = 1 " +
        "WHERE ID = %s ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, Phone, ActivationCode, formatted, formatted), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBID = recordset.recordset[0].ID.toString();
                var DBPersonName = recordset.recordset[0].PersonName.toString();
                var DBUserID = recordset.recordset[0].UserID.toString();
                var DBStoreName = recordset.recordset[0].StoreName.toString();
                var DBPhoneNumber = recordset.recordset[0].PhoneNumber.toString();

                request.query(util.format(qryUpdate, DBID), function (err, recordsetUpdate) {
                    if (err) {
                        res.send({status: false, "errmessage": err});
                        sql.close();
                        res.end();
                        return;
                    }
                    if (recordsetUpdate.rowsAffected.length > 0) {
                        res.send({
                            status: true, "errmessage": "",
                            "UserID": DBUserID,
                            "PersonName": DBPersonName,
                            "StoreName": DBStoreName,
                            "PhoneNumber": DBPhoneNumber
                        });
                        sql.close();
                        res.end();
                        return;
                    }
                });
            }
            else {
                res.send({
                    status: false,
                    "errmessage": "کد فعالسازی صحیح نیست. لطفا مجددا کد پیامک شده را ارسال نمایید"
                });
                res.end();
                sql.close();
                return;

            }
        });
    });
});

module.exports = router;