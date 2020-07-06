var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');
var dateTime = require('node-datetime');
var nowDate;
var formatted;


router.post('/', function (req, res, next) {

    var StoreID = req.body.store_id;
    var PhoneNumber = req.body.phone;
    var PersonName = req.body.person_name;
    var Permission1 = req.body.permission1;
    var Permission2 = req.body.permission2;
    var Permission3 = req.body.permission3;
    var Permission4 = req.body.permission4;

    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');

    var qryString =
        "IF NOT EXISTS (SELECT * FROM [rst].[Users] " +
        "WHERE StoreID = %s AND " +
        "PhoneNumber = \'%s\') " +
        "BEGIN " +
        "INSERT INTO [rst].[Users] " +
        "VALUES (%s, N\'%s\',\'%s\', NULL, 0, %s, %s, %s, %s,\'%s\', NULL) " +
        "END; ";

    sql.connect(db, function (err) {
        if (err) {
            res.send(err);
            sql.close();
            res.end();
            return;
        }

        var request = new sql.Request();

        request.query(util.format(qryString, StoreID, PhoneNumber, StoreID, PersonName, PhoneNumber,
            Permission1, Permission2, Permission3, Permission4, formatted), function (err, recordset) {

            if (err) {
                res.send(err);
                sql.close();
                res.end();
                return;
            }
            // send records as a response
            if (recordset.rowsAffected.length > 0) {
                res.send({
                    status: true
                });
                sql.close();
                res.end();
                return;
            } else {
                res.send({
                    status: false, "errmessage": "داده ارسالی ثبت نشد. ممکن است از قبل وجود داشته باشد"
                });
                sql.close();
                res.end();
                return;
            }

        });
    });

});
module.exports = router;