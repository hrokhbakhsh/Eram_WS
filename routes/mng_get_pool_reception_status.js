var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var OrganizationUnit = req.body.organization_unit;
    var WithOrganization = (OrganizationUnit.length > 10);

    var qryStr =
        'SELECT ' +
        'ISNULL(Sum(PresentMember_Min_Count), 0) PresentMember_Min_Count ' +
        ',CAST(CAST(ISNULL(Max(PresentMember_MinDateTime), GETDATE())AS DATE) AS Nvarchar) PresentMember_MinDateTime ' +
        ',ISNULL(Sum(PresentMember_Max_Count), 0) PresentMember_Max_Count ' +
        ',CAST(CAST(ISNULL(Max(PresentMember_Max_DateTime), GETDATE())AS DATE) AS Nvarchar)PresentMember_Max_DateTime ' +
        ',ISNULL(Sum(AllReceptionedMember_Min_Count), 0) AllReceptionedMember_Min_Count ' +
        ',CAST(CAST(ISNULL(Max(AllReceptionedMember_Min_DateTime), GETDATE())AS DATE) AS Nvarchar)AllReceptionedMember_Min_DateTime ' +
        ',ISNULL(Sum(AllReceptionedMember_Max_Count), 0) AllReceptionedMember_Max_Count ' +
        ',CAST(CAST(ISNULL(Max(AllReceptionedMember_Max_DateTime), GETDATE())AS DATE) AS Nvarchar) AllReceptionedMember_Max_DateTime ' +
        'FROM app.PoolReceptionStatus ';


    if (WithOrganization) {
        qryStr =
            'SELECT ' +
            'ISNULL(Sum(PresentMember_Min_Count), 0) PresentMember_Min_Count ' +
            ',CAST(CAST(ISNULL(Max(PresentMember_MinDateTime), GETDATE())AS DATE) AS Nvarchar) PresentMember_MinDateTime ' +
            ',ISNULL(Sum(PresentMember_Max_Count), 0) PresentMember_Max_Count ' +
            ',CAST(CAST(ISNULL(Max(PresentMember_Max_DateTime), GETDATE())AS DATE) AS Nvarchar)PresentMember_Max_DateTime ' +
            ',ISNULL(Sum(AllReceptionedMember_Min_Count), 0) AllReceptionedMember_Min_Count ' +
            ',CAST(CAST(ISNULL(Max(AllReceptionedMember_Min_DateTime), GETDATE())AS DATE) AS Nvarchar)AllReceptionedMember_Min_DateTime ' +
            ',ISNULL(Sum(AllReceptionedMember_Max_Count), 0) AllReceptionedMember_Max_Count ' +
            ',CAST(CAST(ISNULL(Max(AllReceptionedMember_Max_DateTime), GETDATE())AS DATE) AS Nvarchar) AllReceptionedMember_Max_DateTime ' +
            'FROM app.PoolReceptionStatus ' +
            'Where OrganizationUnit = \'%s\' ';

        qryStr = util.format(qryStr, OrganizationUnit);
    }


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

            var PresentMember_Min_Count = recordset.recordset[0].PresentMember_Min_Count.toString();
            var PresentMember_MinDateTime = recordset.recordset[0].PresentMember_MinDateTime.toString();
            var PresentMember_Max_Count = recordset.recordset[0].PresentMember_Max_Count.toString();
            var PresentMember_Max_DateTime = recordset.recordset[0].PresentMember_Max_DateTime.toString();
            var AllReceptionedMember_Min_Count = recordset.recordset[0].AllReceptionedMember_Min_Count.toString();
            var AllReceptionedMember_Min_DateTime = recordset.recordset[0].AllReceptionedMember_Min_DateTime.toString();
            var AllReceptionedMember_Max_Count = recordset.recordset[0].AllReceptionedMember_Max_Count.toString();
            var AllReceptionedMember_Max_DateTime = recordset.recordset[0].AllReceptionedMember_Max_DateTime.toString();

            res.send({
                status: true, "errmessage": "",
                "PresentMember_Min_Count": PresentMember_Min_Count,
                "PresentMember_MinDateTime": PresentMember_MinDateTime,
                "PresentMember_Max_Count": PresentMember_Max_Count,
                "PresentMember_Max_DateTime": PresentMember_Max_DateTime,
                "AllReceptionedMember_Min_Count": AllReceptionedMember_Min_Count,
                "AllReceptionedMember_Min_DateTime": AllReceptionedMember_Min_DateTime,
                "AllReceptionedMember_Max_Count": AllReceptionedMember_Max_Count,
                "AllReceptionedMember_Max_DateTime": AllReceptionedMember_Max_DateTime
            });
            sql.close();
            res.end();
            return;
        });
    });

});
module.exports = router;