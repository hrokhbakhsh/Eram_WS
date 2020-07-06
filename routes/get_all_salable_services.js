var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;
    var OrganizationUnit = req.body.organization_unit;

    var qryStr =
        'DECLARE @MemberID  UNIQUEIDENTIFIER; ' +
        'SELECT TOP 1 @MemberID =ID FROM krf_MembershipFiles WHERE Person = \'%s\'; ' +
        'EXEC krf.GetSalableOnlineServices ' +
        '@MembershipFileID = @MemberID, '  +
        '@OrganizationUnitID = \'%s\', ' +
        '@ServiceID = null ';

    qryStr = util.format(qryStr, PersonID, OrganizationUnit);


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
                res.send({status: true, "errmessage": "", "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;