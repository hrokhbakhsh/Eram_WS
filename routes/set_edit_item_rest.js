var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.post('/', function (req, res, next) {

    var ItemID = req.body.item_id;
    var StoreName = req.body.store_name;
    var StorePrice = req.body.store_price;
    // var StoreActivated = req.body.store_activated;

    var qryString =
        "UPDATE [rst].[Items] " +
        "SET [Name] = N\'%s\', " +
        "[Price] = %s, " +
        // "[Activated] = %s, " +
        "Deleted = 0 " +
        "WHERE " +
        "[ID] = %s ;";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, StoreName, StorePrice, ItemID), function (err, recordset) {
            if (err)
                res.send(err);
            res.send({
                status: true, "errmessage": ""
            });
            sql.close();
            res.end();
            return;
        });
    });

});
module.exports = router;