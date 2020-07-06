var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var UserID = req.body.user_id;
    var Password = req.body.new_password;

    var qryStr = "UPDATE [rst].Users " +
        "SET Password = \'%s\' " +
        "WHERE ID = %s ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, Password, UserID), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "errmessage": ""});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;


