var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var dateTime = require('node-datetime');
var Status;
var nowDate;
var formatted;

router.post('/', function (req, res, next) {

    var PhoneNumber = req.body.phone;
    var Password = req.body.password;

    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');

    var qryStr = "SELECT top (1) " +
    "u.id AS UserID, " +
    "u.PhoneNumber, " +
    "s.Code AS StoreCode, " +
    "s.ID AS StoreID, " +
    "u.PersonName, " +
    "u.Password " +
    "IsAdmin, " +
    "IsNull(u.Permission1, 0) AS Permission1, " +
    "IsNull(u.Permission2, 0) AS Permission2, " +
    "IsNull(u.Permission3, 0) AS Permission3, " +
    "IsNull(u.Permission4, 0) AS Permission4 " +
    "FROM " +
    "rst.Users AS u " +
    "LEFT JOIN rst.Store AS s ON (u.StoreID = s.id) " +
    "WHERE " +
    "u.PhoneNumber = \'%s\' AND " +
    "u.Password = \'%s\' ;";

    var qryStrUpdateUserLoginDate = "UPDATE rst.Users SET LastDateLogin = \'%s\' WHERE ID = %s";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PhoneNumber, Password), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": "اطلاعات شما در سیستم یافت نشد"});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBPersonID = recordset.recordset[0].UserID.toString();
                var DBPhoneNumber = recordset.recordset[0].PhoneNumber.toString();
                var DBStoreCode = recordset.recordset[0].StoreCode.toString();
                var DBPersonName = recordset.recordset[0].PersonName.toString();
                var DBStoreID = recordset.recordset[0].StoreID.toString();
                var DBIsAdmin = recordset.recordset[0].IsAdmin.toString();
                var DBPermission1 = recordset.recordset[0].Permission1.toString();
                var DBPermission2 = recordset.recordset[0].Permission2.toString();
                var DBPermission3 = recordset.recordset[0].Permission3.toString();
                var DBPermission4 = recordset.recordset[0].Permission4.toString();

                request.query(util.format(qryStrUpdateUserLoginDate, formatted, DBPersonID), function (err, recordset) {

                    if (err) {
                        res.send({status: false, "errmessage": "اطلاعات شما در سیستم یافت نشد"});
                        sql.close();
                        res.end();
                        return;
                    }

                    res.send({
                        status: true, "errmessage": "",
                        "UserID": DBPersonID,
                        "PersonName": DBPersonName,
                        "StoreCode": DBStoreCode,
                        "StoreID": DBStoreID,
                        "PhoneNumber": DBPhoneNumber,
                        "IsAdmin": DBIsAdmin,
                        "Permission1": DBPermission1,
                        "Permission2": DBPermission2,
                        "Permission3": DBPermission3,
                        "Permission4": DBPermission4,

                    });
                    sql.close();
                    res.end();
                    return;
                });
            }
            else {
                res.send({
                    status: false,
                    "errmessage": "نام کاربری یا رمز ورود صحیح نیست."
                });
                res.end();
                sql.close();
                return;

            }

        });
    });

});
module.exports = router;