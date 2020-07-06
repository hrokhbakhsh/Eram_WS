/**
 * Created by cmos on 20/02/2018.
 */
var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');

router.post('/', function (req, res, next) {
    var ServiceID = req.body.service_id;
    var RemainCharge = req.body.remain_charge;
    var MembershipFileID = req.body.membership_file_id;
    var ExpireDate = req.body.expire_date;
    var FactorDate = req.body.factor_date;
    var FactorTime = req.body.factor_time;
    var DetailFactor = req.body.detail_factor;
    var StoreID = req.body.store_id;
    var UserID = req.body.user_id;
    var Increase = req.body.increase;
    var Decrease = req.body.decrease;
    var Description = req.body.description;
    var Payment = req.body.payment;
    var FactorPrice = req.body.factor_price;
    var obj = JSON.parse(DetailFactor);
    var records = [obj.length];

    var qryString =
        "BEGIN TRANSACTION; " +
        "DECLARE @vocno [int]; " +
        "INSERT INTO [rst].[Factor] " +
        "VALUES (\'%s\',%s, %s, \'%s\', \'%s\' , \'%s\',\'%s\',\'%s\', %s, %s, N'%s', %s,\'%s\') " +
    "SELECT @vocno = SCOPE_IDENTITY(); " +
    "SELECT @vocno AS FactorID;" +
    "COMMIT TRANSACTION;";

    sql.connect(db, function (err) {
        if (err) {
            res.send({
                status: false, "errmessage": err
            });
            res.end();
            return;
        }
        var request = new sql.Request();
        request.query(util.format(qryString, ServiceID, StoreID, UserID, MembershipFileID, RemainCharge,
            ExpireDate, FactorDate,FactorPrice, Increase, Decrease, Description, Payment, FactorTime), function (err, recordset) {
            if (err) {
                sql.close();
                res.send({
                    status: false, "errmessage": err
                });
                res.end();
                return;
            }
            var MasterID =  recordset.recordset[0].FactorID.toString();

            var sss;
            if (recordset.rowsAffected.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    records[i] = "(" + MasterID + " , " + obj[i].id + ",\N'" + obj[i].name + "\'," + obj[i].price + "," + obj[i].numberSelected + " , " + obj[i].price * obj[i].numberSelected + ")";
                    if (i > 0)
                        sss = sss + "," + records[i];
                    if (i === 0)
                        sss = records[i];
                }

                var qryStringDetail =

                    "INSERT INTO [rst].[FactorDetails] " +
                    "VALUES %s ";

                request.query(util.format(qryStringDetail, sss), function (err, recordset) {

                    if (err) {
                        sql.close();
                        res.send({
                            status: false, "errmessage": err
                        });
                        res.end();
                        return;
                    }
                    if (recordset.rowsAffected.length > 0) {
                        res.send({
                            status: true
                        });
                        sql.close();
                        res.end();
                        return;
                    } else {
                        res.send({
                            status: false, "errmessage": "داده ارسالی ثبت نشد."
                        });
                        sql.close();
                        res.end();
                        return;
                    }

                });
            } else {
                res.send({
                    status: false, "errmessage": "داده ارسالی ثبت نشد. ممکن است از قبل وجود داشته باشد"
                });
                sql.close();
                res.end();
                return;
            }
        });
    });
});
module.exports = router;