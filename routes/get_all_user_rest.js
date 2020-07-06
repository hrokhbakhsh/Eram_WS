var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.post('/', function (req, res, next) {

    var StoreID = req.body.store_id;

    var qryString =
        "SELECT ID, PersonName, PhoneNumber, Permission1, Permission2, Permission3, Permission4, LastDateLogin " +
        "FROM [rst].[Users] " +
        "WHERE StoreID = %s AND IsAdmin = 0 ";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, StoreID), function (err, recordset) {

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