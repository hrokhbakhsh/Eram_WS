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
        "SELECT ReceivedPos.ID, ReceivedPos.CreationTime, Settlement.MembershipFile, ReceivedPos.Amount, 'Pos' ReceiveType " +
        "FROM rp_ReceivedPoses ReceivedPos " +
        "inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Pos = ReceivedPos.ID " +
        "inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp " +
        "WHERE MembershipFile = @MembershipFilesID " +
        "UNION " +
        "SELECT NaghdeDaryafti.ID, NaghdeDaryafti.CreationTime, Settlement.MembershipFile, NaghdeDaryafti.Amount, 'Naghd' ReceiveType " +
        "FROM rp_NaghdeDaryafti NaghdeDaryafti " +
        "inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Naghd = NaghdeDaryafti.ID " +
        "inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp " +
        "WHERE MembershipFile = @MembershipFilesID " +
        "UNION " +
        "SELECT ReceivedCheque.ID, ReceivedCheque.CreationTime, Settlement.MembershipFile, ReceivedCheque.Amount, 'Cheque' ReceiveType " +
        "FROM rp_ReceivedCheques ReceivedCheque " +
        "inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Cheque = ReceivedCheque.ID " +
        "inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp " +
        "WHERE MembershipFile = @MembershipFilesID " +
        "UNION " +
        "SELECT ID, CreationTime, MembershipFile, TotalAmount, 'KasrAzCharge' ReceiveType " +
        "FROM krf_UsedCharges " +
        "WHERE MembershipFile = @MembershipFilesID " +
        "ORDER BY (CreationTime) DESC";

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