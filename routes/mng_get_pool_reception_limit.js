var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var FromDate = req.body.from_date;
    var ToDate = req.body.to_date
    var OrganizationUnit = req.body.organization_unit;
    var WithOrganization = (OrganizationUnit.length > 10);

    var qryStr =
        'SELECT ISNULL(SUM(AllReceptionedMemberCount), 0) AS AllReceptionedMemberCount ' +
        'FROM app.PoolReceptionReport_Day ' +
        'WHERE (Date_Fa >= \'%s\') ' +
        'AND (Date_Fa <= \'%s\') ';

    qryStr = util.format(qryStr, FromDate, ToDate);

    if (WithOrganization) {
        qryStr = qryStr + 'AND OrganizationUnit = \'%s\'';
        qryStr = util.format(qryStr, OrganizationUnit);
    }


    sql.close();
    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(qryStr, function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }

            var AllReceptionedMemberCount = recordset.recordset[0].AllReceptionedMemberCount.toString();

            res.send({
                status: true, "errmessage": "",
                "AllReceptionedMemberCount": AllReceptionedMemberCount
            });
            sql.close();
            res.end();
            return;
        });
    });

});
module.exports = router;