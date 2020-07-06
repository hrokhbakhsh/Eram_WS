var express = require('express');
var db = require('../public/db');
var router = express.Router();
var sql = require('mssql');


router.get('/', function (req, res, next) {

    var qryString =
        "SELECT " +
        "p.id AS MembershipFileID, " +
        "m.personID AS PersonID, " +
        "m.phoneNumber, " +
        "c.LoginPassword, " +
        "m.TokenKey, " +
        "c.StoredDisplayText AS PersonName, " +
        "g.[Name] As Gender " +
        "FROM [app].MobileDeviceInfo AS m " +
        "LEFT JOIN krf_MembershipFiles AS p ON (m.personID = p.Person) " +
        "LEFT JOIN cmn_Persons AS c ON (m.personID = c.ID) " +
        "LEFT JOIN afw_OptionSetItems AS g ON (p.gender = g.id) ";

    sql.connect(db, function (err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(qryString, function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            sql.close();
        });
    });

});
module.exports = router;