/**
 * Created by cmos on 21/02/2018.
 */
var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');

router.post('/', function (req, res, next) {

    var StoreID = req.body.store_id;
    var FromDate = req.body.from_date;
    var ToDate = req.body.to_date;

    var qryString =
        "SELECT f.ID, f.ServiceID, StoreID, UserID, f.MembershipFileID, ServiceRemainCharge," +
        "ServiceExpireDate, FactorDate,FactorTime,FactorPrice,IncreasePrice,DecreasePrice,f.Description,Payed,p.StoredDisplayText as customerName " +
        "FROM [rst].[Factor] as f " +
        "Left join [krf_MembershipFiles] as m on(f.MembershipFileID = m.id) " +
        "left join [cmn_persons] as p on(m.person = p.id) " +
        "WHERE StoreID = %s and FactorDate between \'%s\' and  \'%s\' order by FactorDate desc";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(util.format(qryString, StoreID, FromDate, ToDate), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.rowsAffected.length > 0) {
                res.send({status: true, "Result": recordset.recordset});
                sql.close();
                res.end();
                return;
            }
        });
    });

});
module.exports = router;