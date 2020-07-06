var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.post('/', function (req, res, next) {

    var UserID = req.body.user_id;
    var PersonName = req.body.person_name;
    var PhoneNumber = req.body.phone;
    var Permission1 = req.body.permission1;
    var Permission2 = req.body.permission2;
    var Permission3 = req.body.permission3;
    var Permission4 = req.body.permission4;

    var qryString =
        "UPDATE [rst].[Users] " +
        "SET [PersonName] =  N\'%s\', " +
        "[PhoneNumber] =  \'%s\', " +
        "[Permission1] = %s, " +
        "[Permission2] = %s, " +
        "[Permission3] = %s, " +
        "[Permission4] = %s " +
        "WHERE ID = %s";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, PersonName, PhoneNumber, Permission1, Permission2, Permission3, Permission4, UserID), function (err, recordset) {

            if (err) {
                res.send({
                    status: true, "errmessage": err
                });
                sql.close();
                return;
            }
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