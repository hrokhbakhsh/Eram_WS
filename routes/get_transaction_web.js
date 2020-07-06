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
        "SELECT ReceivedPos.ID,  " +
        "        FORMAT(ReceivedPos.CreationTime, 'yy/MM/dd', 'fa') CreationDate, " +
        "        FORMAT(ReceivedPos.CreationTime, 'hh:mm') CreationTime, " +
        "        Settlement.MembershipFile, ReceivedPos.Amount,  " +
        "        'Pos' ReceiveType, " +
        "        N'دستگاه کارت خوان' ReceiveType_Text " +
        "        FROM rp_ReceivedPoses ReceivedPos   " +
        "        inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Pos = ReceivedPos.ID   " +
        "        inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp   " +
        "        WHERE MembershipFile = @MembershipFilesID   " +
        "        UNION   " +
        "        SELECT NaghdeDaryafti.ID,  " +
        "        FORMAT(NaghdeDaryafti.CreationTime, 'yy/MM/dd', 'fa') CreationDate, " +
        "        FORMAT(NaghdeDaryafti.CreationTime, 'hh:mm') CreationTime, " +
        "        Settlement.MembershipFile, NaghdeDaryafti.Amount,  " +
        "        'Naghd' ReceiveType, " +
        "        N'نقدی' ReceiveType_Text " +
        "        FROM rp_NaghdeDaryafti NaghdeDaryafti   " +
        "        inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Naghd = NaghdeDaryafti.ID   " +
        "        inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp   " +
        "        WHERE MembershipFile = @MembershipFilesID   " +
        "        UNION   " +
        "        SELECT ReceivedCheque.ID,  " +
        "        FORMAT(ReceivedCheque.CreationTime, 'yy/MM/dd', 'fa') CreationDate, " +
        "        FORMAT(ReceivedCheque.CreationTime, 'hh:mm') CreationTime, " +
        "        Settlement.MembershipFile, ReceivedCheque.Amount,  " +
        "        'Cheque' ReceiveType, " +
        "        N'چک' ReceiveType_Text " +
        "        FROM rp_ReceivedCheques ReceivedCheque  " +
        "        inner join rp_ReceiveReceiptItems ReceiveReceiptItem on ReceiveReceiptItem.FinancialItem_Cheque = ReceivedCheque.ID  " +
        "        inner join krf_MembershipFileSettlements Settlement on Settlement.ID = ReceiveReceiptItem.CreatorOp  " +
        "        WHERE MembershipFile = @MembershipFilesID  " +
        "        UNION   " +
        "        SELECT ID,  " +
        "        FORMAT(CreationTime, 'yy/MM/dd', 'fa') CreationDate, " +
        "        FORMAT(CreationTime, 'hh:mm') CreationTime, " +
        "        MembershipFile, TotalAmount,  " +
        "        'KasrAzCharge' ReceiveType, " +
        "        N'کسر از شارژ' ReceiveType_Text" +
        "        FROM krf_UsedCharges  " +
        "        WHERE MembershipFile = @MembershipFilesID  " +
        " ORDER BY CreationDate DESC , CreationTime DESC; ";

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