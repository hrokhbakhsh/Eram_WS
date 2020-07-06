var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');


var Status;
router.post('/', function (req, res, next) {

    var PersonID = req.body.person_id;

    var qryStr =
        "DECLARE @MembershipFileID uniqueidentifier " +
        "SELECT @MembershipFileID = ID From Krf_MembershipFiles WHERE Person = \'%s\' " +
        "EXEC krf.CalculateMembershipsWalletStock @MembershipFileID, 'All' , 1 ";


    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PersonID), function (err, recordset) {

            if ((recordset.recordset !== undefined) && (recordset.recordset.length > 0)) {
                res.send(recordset.recordset[0]);
                sql.close();
                res.end();
                return;
            }
            else {
                res.send({"UnLimitedAmountsSum": 0,
                          "UsedUnLimitedAmountsSum": 0,
                          "UnLimitedWalletStock": 0,
                          "LimitedAmountsSum": 0,
                          "UsedLimitedAmountsSum": 0,
                          "LimitedWalletStock": 0
                         });
                sql.close();
                res.end();
                return;

            }

        });
    });

});
module.exports = router;


