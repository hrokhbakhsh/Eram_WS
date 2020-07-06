var express = require('express');
var router = express.Router();

var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');

var Status;

router.post('/', function (req, res, next) {

    var PhoneNumber = req.body.phone;
    var Password = req.body.password;

    var qryStr = 
	    "SELECT top (1) " +
        "p.id, " + 
        "p.MobilePhoneNumber1, " +
        "ISNULL(m.CardNumber, '0') AS CardNumber, " + 
		"ISNULL(g.Title + ' ' + ISNULL(p.StoredDisplayText, N'نامشخص') + '_' + ISNULL(h.Title, '') , 'نامشخص' ) + '(' + CONVERT(varchar(10),ISNULL(m.CardNumber, '0'))  +')' AS PersonName, " +
        "ISNULL(g.Title + ' ' + p.StoredDisplayText, 'نامشخص') AS PersonNameOnly, " + 
        "ISNULL(p.Name, '_') AS FirstName, " +
		"ISNULL(p.LastName, '_') AS LastName, " +
		"ISNULL(h.Title, 'نامشخص') AS Grade, " + 
        "p.loginPassword, " + 
        "ISNULL(pic.[Image], 0) AS Image, " + 
        "o.Title AS Organ,  " +
        "m.PersianMembershipDate  " +
        "FROM  " +
        "cmn_Persons AS p  " +
        "LEFT JOIN afw_OptionSetItems AS g ON (p.gender = g.id) " + 
        "LEFT JOIN krf_MembershipFiles AS m ON (p.ID = m.Person)  " +
        "LEFT JOIN krf_MemberGrades as h on (m.MemberGrade = h.ID)  " +
        "LEFT JOIN [app].PictureAccount AS pic ON (pic.PersonID = p.ID) " + 
        "LEFT JOIN dbo.krf_Organizations AS o ON (o.ID = m.Organization)  " +
        "WHERE p.MobilePhoneNumber1 = \'%s\' AND " +
        "p.loginPassword = \'%s\' ";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryStr, PhoneNumber, Password), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBPersonID = recordset.recordset[0].id.toString();
                var DBMobilePhoneNumber = recordset.recordset[0].MobilePhoneNumber1.toString();
                var DBCardNumber = recordset.recordset[0].CardNumber.toString();
                var DBPersonName = recordset.recordset[0].PersonName.toString();
                var DBImage = recordset.recordset[0].Image.toString();
				var DBPersonNameOnly = recordset.recordset[0].PersonNameOnly.toString();
				var DBFirstName = recordset.recordset[0].FirstName.toString();
				var DBLastName = recordset.recordset[0].LastName.toString();
				var DBGrade = recordset.recordset[0].Grade.toString();
				var DBOrgan = recordset.recordset[0].Organ.toString();
                var	DBPersianMembershipDate = recordset.recordset[0].PersianMembershipDate.toString();			
                res.send({
                    status: true, "errmessage": "",
                    "CardNumber": DBCardNumber,
                    "PersonName": DBPersonName,
                    "PersonID": DBPersonID,
                    "PhoneNumber": DBMobilePhoneNumber,
                    "PersonImage": DBImage,
					"PersonNameOnly": DBPersonNameOnly,
					"FirstName": DBFirstName,
					"LastName": DBLastName,
					"Grade": DBGrade,
					"Organ": DBOrgan,
					"StartDate": DBPersianMembershipDate 
                });
                sql.close();
                res.end();
                return;

            }
            else {
                res.send({
                    status: false,
                    "errmessage": "نام کاربری یا رمز ورود صحیح نیست."
                });
                res.end();
                sql.close();
                return;

            }

        });
    });

});
module.exports = router;