var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var nowDate;
var Validate;
var formatted;
var ExistUser;

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    var ActivationCode = req.body.activation_code;
    var Phone = req.body.phone;

    var qryStr = "SELECT TOP 1 " +
        "t.ID, " +
        "p.ID AS PersonID, " +
        "ISNULL(m.CardNumber, '0') AS CardNumber, " +
		"p.MobilePhoneNumber1, " +
		"ISNULL(g.Title + ' ' + ISNULL(p.StoredDisplayText, N'نامشخص') + '_' + ISNULL(h.Title, '') , 'نامشخص' ) + '(' + CONVERT(varchar(10),ISNULL(m.CardNumber, '0'))  +')' AS PersonName, " +
        "ISNULL(g.Title + ' ' + p.StoredDisplayText, 'نامشخص') AS PersonNameOnly, " + 
		"ISNULL(p.Name, '_') AS FirstName, " +
        "ISNULL(p.LastName, '_') AS LastName, " +
        "CASE g.Title " +
        "WHEN N'آقای' THEN N'مرد' " +
        "WHEN N'خانم' THEN N'زن' " +
        "ELSE N'نامشخص' " +
        "END as Gender, " +
        "ISNULL(pa.Image, '') Image, " +
        "ISNULL(t.PhoneNumber, '0') PhoneNumber, " +
		"o.Title AS Organ,  " +
		"ISNULL(h.Title, 'نامشخص') AS Grade, " + 
        "m.PersianMembershipDate  " +
        "FROM [app].[Tmp_ActivationCode] AS t " +
        "LEFT JOIN cmn_Persons AS p ON (t.personID = p.ID) " +
        "LEFT JOIN afw_OptionSetItems AS g ON (p.gender = g.id) " +
        "LEFT JOIN app.PictureAccount AS pa ON (pa.PersonID = p.ID) " +
        "LEFT JOIN dbo.krf_MembershipFiles AS m ON (m.Person = p.id) " +
		"LEFT JOIN krf_MemberGrades as h on (m.MemberGrade = h.ID)  " +
		"LEFT JOIN dbo.krf_Organizations AS o ON (o.ID = m.Organization)  " +
        "WHERE " +
        "t.PhoneNumber = \'%s\' AND " +
        "ActivationCode = %s AND " +
        "Used = 0 AND " +
        "ExpirationDateTime >= \'%s\' AND " +
        "t.CreatedDateTime <= \'%s\' ";

    var qryUpdate = "UPDATE [app].[Tmp_ActivationCode] " +
        "SET Used = 1 " +
        "WHERE ID = %s ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, Phone, ActivationCode, formatted, formatted), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBID = recordset.recordset[0].ID.toString();
                var DBFirstName = recordset.recordset[0].FirstName.toString();
                var DBLastName = recordset.recordset[0].LastName.toString();
                var DBGender = recordset.recordset[0].Gender.toString();
                var DBPhoneNumber = recordset.recordset[0].PhoneNumber.toString();
                var DBPersonID = recordset.recordset[0].PersonID.toString();
                var DBPersonImage = recordset.recordset[0].Image.toString();
                var DBCardNumber = recordset.recordset[0].CardNumber.toString();
                var DBPersonNameOnly = recordset.recordset[0].PersonNameOnly.toString();
				var DBGrade = recordset.recordset[0].Grade.toString();
				var DBOrgan = recordset.recordset[0].Organ.toString();
                var	DBPersianMembershipDate = recordset.recordset[0].PersianMembershipDate.toString();	
                request.query(util.format(qryUpdate, DBID), function (err, recordsetUpdate) {
                    if (err) {
                        res.send({status: false, "errmessage": err});
                        sql.close();
                        res.end();
                        return;
                    }
                    if (recordsetUpdate.rowsAffected.length > 0) {
                        res.send({
                            status: true, "errmessage": "",
                            "FirstName": DBFirstName,
                            "LastName": DBLastName,
                            "Gender": DBGender,
                            "PersonID": DBPersonID,
                            "PhoneNumber": DBPhoneNumber,
                            "PersonImage": DBPersonImage,
                            "CardNumber": DBCardNumber,
							"PersonNameOnly": DBPersonNameOnly,
							"Grade": DBGrade,
							"Organ": DBOrgan,
							"StartDate": DBPersianMembershipDate 
                        });
                        sql.close();
                        res.end();
                        return;
                    }
                });
            }
            else {
                res.send({
                    status: false,
                    "errmessage": "کد فعالسازی صحیح نیست. لطفا مجددا کد پیامک شده را ارسال نمایید"
                });
                res.end();
                sql.close();
                return;

            }
        });
    });
});

module.exports = router;