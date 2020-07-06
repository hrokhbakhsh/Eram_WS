var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var Date_Eng = req.body.date_eng;
    var OrganizationUnit = req.body.organization_unit;
    var WithOrganization = (OrganizationUnit.length > 10);

    var qryStr =
        'DECLARE @lNow DATETIME, ' +
        '@OrganizationUnit UNIQUEIDENTIFIER; ' +
        'SET @lNow =  \'%s\' ; ';
    qryStr = util.format(qryStr, Date_Eng);

    if (WithOrganization) {
        qryStr = qryStr + ' SET @OrganizationUnit = \'%s\' ; ';
        qryStr = util.format(qryStr, OrganizationUnit);
    }

    qryStr = qryStr +
        'SELECT ' +
        '( ' +
        'SELECT ISNULL(SUM(PoolReception.KasrEtebar), 0) ' +
        'FROM krf_PoolReceptions PoolReception ' +
        'WHERE (CAST(PoolReception.ReceptionDate AS Date) = @lNow) ' +
        'AND (PoolReception.IsReleased = 1) ' ;

    if (WithOrganization) {
        qryStr = qryStr +' AND (PoolReception.OrganizationUnit = @OrganizationUnit) ';
    }

    qryStr = qryStr +
        ') PresentMemberCount, ' +
        '( ' +
        'SELECT ISNULL(SUM(PoolReception.KasrEtebar), 0) ' +
        'FROM krf_PoolReceptions PoolReception ' +
        'WHERE (CAST(PoolReception.ReceptionDate AS DATE) = @lNow) ' +
        'AND (PoolReception.IsReleased = 0) ';

    if (WithOrganization) {
        qryStr = qryStr +' AND (PoolReception.OrganizationUnit = @OrganizationUnit) ';
    }
    qryStr = qryStr +
        ') ExitedMemberCount, ' +
        '( ' +
        'SELECT ISNULL(SUM(PoolReception.KasrEtebar), 0) ' +
        'FROM krf_PoolReceptions PoolReception ' +
        'WHERE (CAST(PoolReception.ReceptionDate AS Date) = @lNow) ';

    if (WithOrganization) {
        qryStr = qryStr +' AND (PoolReception.OrganizationUnit = @OrganizationUnit) ';
    }

    qryStr = qryStr +
        ') AllReceptionedMemberCount; ';

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

            var PresentMemberCount = recordset.recordset[0].PresentMemberCount.toString();
            var ExitedMemberCount = recordset.recordset[0].ExitedMemberCount.toString();
            var AllReceptionedMemberCount = recordset.recordset[0].AllReceptionedMemberCount.toString();
            res.send({
                status: true, "errmessage": "",
                "PresentMemberCount": PresentMemberCount,
                "ExitedMemberCount": ExitedMemberCount,
                "AllReceptionedMemberCount": AllReceptionedMemberCount
            });
            sql.close();
            res.end();
            return;
        });
    });

});
module.exports = router;