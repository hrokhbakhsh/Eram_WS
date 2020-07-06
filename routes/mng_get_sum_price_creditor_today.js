var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {
    var OrganizationUnit = req.body.organization_unit;
    var WithOrganization = (OrganizationUnit.length > 10);

    var qryStr =
        "SELECT ISNULL(Sum(TotalAmount), 0) As SumTotalAmount " +
        "FROM app.Tmp_DebtorAmountsReport_Day ";


    if (WithOrganization) {
        qryStr = qryStr + ' WHERE OrganizationUnit = \'%s\' ';
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
            var SumTotalAmount = recordset.recordset[0].SumTotalAmount;

            res.send({
                status: true, "errmessage": "", "SumTotalAmount": SumTotalAmount
            });
            sql.close();
            res.end();
            return;
        });
    });

});
module.exports = router;