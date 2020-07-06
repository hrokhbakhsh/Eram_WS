var express = require('express');
var router = express.Router();
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var Status;

router.post('/', function (req, res, next) {
    var Message = req.body.message;

    var qryStr =
        "SELECT [TokenKey] FROM [app].[MobileDeviceInfo] " +
        "WHERE NOT ([TokenKey] IS NULL) ";

    var registrationToken = [];

    var payload = {
        data: {
            score: "850",
            time: "2:45",
            message: Message,
            type: "2"
        }
    };

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(qryStr, function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {

                for(var i=0;i<recordset.recordset.length;i++){
                    registrationToken.push(recordset.recordset[i].TokenKey);
                }


                admin.messaging().sendToDevice(registrationToken, payload)
                    .then(function (response) {
                        console.log("Successfully sent message:", response);
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                    });

                res.send({status: true, "errmessage": ""});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;