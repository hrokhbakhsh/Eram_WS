var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.post('/', function (req, res, next) {

    var ItemID = req.body.item_id;
    var StoreActivated = req.body.store_activated;

    var qryString =
        "UPDATE [rst].[Items] " +
        "SET [Activated] = %s " +
        "WHERE " +
        "[ID] = %s ;";

    sql.connect(db, function (err) {
        if (err)
            res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, StoreActivated, ItemID), function (err, recordset) {

            if (err)
                res.send(err);

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