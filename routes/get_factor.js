var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;

    var qryExtended = " ";
    var qrySort = " ";

    var qryStr =
        "DECLARE @MembershipFilesID uniqueidentifier " +
        "SET @MembershipFilesID = (select top (1) id from krf_MembershipFiles " +
        "WHERE Person = \'%s\'); " +
        "SELECT " +
        "SalesInvoice.ID AS FactorID, " +
        "ReceptionUnit.Title ReceptionUnit_Text, " +
        "AssignedLocker.LockerNumber, " +
        "SalesInvoice.TotalPrice, " +
        "afw.GregorianToPersian(SalesInvoice.InvoiceDate) InvoiceDate, " +
        "SalesInvoice.FactorNo " +
        "FROM krf_SalesInvoices SalesInvoice " +
        "LEFT JOIN krf_PoolReceptionAssignedLockers AssignedLocker on AssignedLocker.ID = SalesInvoice.PoolReceptionAssignedLocker " +
        "LEFT JOIN krf_ReceptionUnits ReceptionUnit on ReceptionUnit.ID = SalesInvoice.ReceptionUnit " +
        "LEFT JOIN krf_PoolReceptions PoolReception on PoolReception.ID = SalesInvoice.PoolReception " +
        "LEFT JOIN krf_MembershipFileLookUpView MembershipFile on MembershipFile.ID = PoolReception.MembershipFile " +
        "WHERE MembershipFile.ID = @MembershipFilesID " +
        "ORDER BY (SalesInvoice.InvoiceDate) DESC ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PersonID), function (err, recordset) {

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