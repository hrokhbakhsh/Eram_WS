var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.get('/', function (req, res, next) {

    var qryStrOne =
        "SELECT " +
        "(SELECT ISNULL(SUM(PoolReception.KasrEtebar), 0) "+
        "FROM krf_PoolReceptions PoolReception " +
        "WHERE CAST(PoolReception.ReceptionDate AS DATE) =  CAST(GETDATE() AS DATE) " +
        "AND PoolReception.IsReleased = 1  " +
        ") PresentMemberCount, " +
        "(SELECT ISNULL(SUM(PoolReception.KasrEtebar), 0) " +
        "FROM krf_PoolReceptions PoolReception " +
        "WHERE Cast(PoolReception.ReceptionDate AS DATE) =  CAST(GETDATE() AS DATE) " +
        "AND PoolReception.IsReleased = 0 " +
        ") ExitedMemberCount " ;


    var qryStr2 =
         "SELECT ISNULL(SUM(TotalAmount), 0) AS SumTotalAmount_Creditor  " +
         "FROM krf.DayCreditorAmounts(format(GETDATE(), 'yyyy/MM/dd 00:00:00', 'En'), GETDATE(), NULL, 0, 0) ";

    var qryStr3 =
        "SELECT " +
        "CAST(ISNULL(SUM(TotalAmount), 0) AS INT) AS SumTotalAmount_Receipt " +
        "FROM rp_ReceiveReceipts r " +
        "LEFT JOIN afw_OptionSetItems t ON (t.ID=r.ReceiptType) " +
        "WHERE Cast(ReceiptDate AS Date) = CAST(GETDATE() AS DATE) AND " +
        "t.Name=\'Varzesh\'; "

    sql.close();
    sql.Connect(db, function (err) {
        var request = new sql.Request();
        var request2 = new sql.Request();
        var request3 = new sql.Request();

        request.query(qryStrOne, function (err, recordset1) {
            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            var PresentMemberCount = recordset1.recordset[0].PresentMemberCount.toLocaleString();
            var ExitedMemberCount = recordset1.recordset[0].ExitedMemberCount.toLocaleString();

            request3.query(qryStr3, function (err, recordset3) {
                if (err) {
                    res.send({status: false, "errmessage": err});
                    sql.close();
                    res.end();
                    return;
                }
                var SumTotalAmount_Receipt = recordset3.recordset[0].SumTotalAmount_Receipt.toLocaleString();

            request2.query(qryStr2, function (err, recordset2) {
                if (err) {
                    res.send({status: false, "errmessage": err});
                    sql.close();
                    res.end();
                    return;
                }
                var SumTotalAmount_Creditor = recordset2.recordset[0].SumTotalAmount_Creditor.toLocaleString();

                    res.send({status: true, "errmessage": "", "Result":{
                            "PresentMemberCount": PresentMemberCount,
                            "ExitedMemberCount": ExitedMemberCount,
                            "SumTotalAmount_Creditor": SumTotalAmount_Creditor,
                            "SumTotalAmount_Receipt":SumTotalAmount_Receipt}

                    })
                    sql.close();
                    res.end();
                    return;

                });

            });
        });
    });
});
module.exports = router;