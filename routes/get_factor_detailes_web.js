var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var FactorID = req.body.factor_id;

    var qryStr =
        "SELECT " + 
		"format(SalesInvoiceItem.CreationTime, 'yyyy/MM/dd', 'fa') CreationDate, " +
        "format(SalesInvoiceItem.CreationTime, 'HH:mm') CreationTime, " +
        "StuffServiceGroup.Code, StuffServiceGroup.Title Stuff_Text , " +
        "SalesInvoiceItem.Value, SalesInvoiceItem.UnitPrice, SalesInvoiceItem.TotalAmount AS TotalPrice " +
        "FROM krf_SalesInvoiceItems SalesInvoiceItem " +
        "INNER JOIN krf_StuffServices StuffServiceGroup on StuffServiceGroup.ID = SalesInvoiceItem.StuffService " +
        "WHERE SalesInvoiceItem.SalesInvoice =  \'%s\' order by (SalesInvoiceItem.RowNo) asc "


    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, FactorID), function (err, recordset) {

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