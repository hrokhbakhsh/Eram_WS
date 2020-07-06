var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var UserName = req.body.user_name;
    var Password = req.body.password;

    var qryStr = 'SELECT TOP (1) ' +
    '    m.ID, '+
    '    SystemUserID, ' +
    '    s.Name ' +
    'FROM [app].[ManagerUser] AS m ' +
    'LEFT JOIN afw_SystemUsers AS s ON (m.SystemUserID = s.ID) ' +
    'WHERE s.UserName = N\'%s\' AND s.LoginPassword = N\'%s\'  ' +
    '      AND s.IsActive = 1 ';

    sql.close();
    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, UserName, Password), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var SystemUserID = recordset.recordset[0].SystemUserID.toString();
                var Name = recordset.recordset[0].Name.toString();
                res.send({
                    status: true, "errmessage": "",
                    "SystemUserID": SystemUserID,
                    "Name": Name
                });
                sql.close();
                res.end();
                return;

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