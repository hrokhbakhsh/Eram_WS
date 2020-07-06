var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;
    var OrganizationUnit = req.body.organization_unit;
    var ServiceID = req.body.service_id;
    var ServiceType = req.body.service_type;

    var qryStr =
        'DECLARE @MemberID  UNIQUEIDENTIFIER; ' +
        'SELECT TOP 1 @MemberID =ID FROM krf_MembershipFiles WHERE Person = \'%s\'; ' +
        'EXEC krf.PackageRegistrationRequest ' +
        '@MembershipFileID = @MemberID, ' +
        '@ServiceID = \'%s\', ' +
        '@OrganizationUnitID = \'%s\', ' +
        '@ServiceType = N\'%s\'; ';

    qryStr = util.format(qryStr, PersonID, ServiceID, OrganizationUnit, ServiceType);


    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(qryStr, function (err, recordset) {

            if (err) {
                res.send({"Result": -1, "ResultMessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({"Result": recordset.recordset[0].Result, "ResultMessage": recordset.recordset[0].ResultMessage});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;