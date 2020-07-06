var express = require('express');
var router = express.Router();

var app = require('../app').con;
var dateTime = require('node-datetime');
var nowDate;
var formatted;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    var PersonID = req.body.person_id;
    var ImageUser = req.body.image;
    var PhoneNumber = req.body.phone;

    var qryStr = "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; " +
        "BEGIN TRANSACTION; " +
        "IF EXISTS (SELECT 1 FROM [app].[PictureAccount] WHERE PhoneNumber = \'%s\') " +
        "BEGIN " +
        "UPDATE [app].[PictureAccount] " +
        "SET " +
        "PersonID = \'%s\', " +
        "Image = \'%s\', " +
        "ModifiedDateTime = \'%s\' " +
        "WHERE PhoneNumber = \'%s\' " +
        "END " +
        "ELSE " +
        "BEGIN " +
        "INSERT INTO [app].[PictureAccount] (PhoneNumber, PersonID, Image, CreatedDateTime) " +
        "VALUES (\'%s\', \'%s\', \'%s\', \'%s\') " +
        "END " +
        "COMMIT TRANSACTION; ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PhoneNumber, PersonID, ImageUser, formatted, PhoneNumber, PhoneNumber, PersonID, ImageUser, formatted), function (err, recordset) {

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
