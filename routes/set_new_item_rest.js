var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.post('/', function (req, res, next) {

    var StoreID = req.body.store_id;
    var StoreName = req.body.store_name;
    var StorePrice = req.body.store_price;
    var StoreActivated = req.body.store_activated;

    var qryString =
        "IF NOT EXISTS (SELECT * FROM [rst].[Items] " +
        "WHERE StoreID = %s AND " +
        "Name = N\'%s\' AND " +
        "Deleted = 0) " +
        "BEGIN " +
        "INSERT INTO [rst].[Items] " +
        "VALUES (%s, N\'%s\', %s, %s, 0) " +
        "END;  ";

    sql.connect(db, function (err) {
        if (err) {
            res.send(err);
            res.end();
            return;
        }

        var request = new sql.Request();

        request.query(util.format(qryString, StoreID, StoreName, StoreID, StoreName, StorePrice, StoreActivated), function (err, recordset) {

            if (err) {
                res.send(err);
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