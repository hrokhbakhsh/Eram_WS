var express = require('express');
var router = express.Router();
var rn = require('random-number');
var dateTime = require('node-datetime');
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var nowDate;
var formatted;
var IsCredit;
var Status;

var gen = rn.generator({
    min: 1000
    , max: 9999
    , integer: true
});

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    var ActivationCode = gen();

    var MembershipFilID = req.body.membership_file_id;
    var RegistrationID = req.body.id;
    var ServiceType = req.body.service_type;
    var GuestPhoneNumber = req.body.guest_phone;
    var GuestCount = req.body.guest_count;
    var GuestExpireCount = req.body.guest_expire;
    var PermissionCreditUse = req.body.is_credit;


    IsCredit = 0;
    if (PermissionCreditUse) {
        IsCredit = 1;
    }

    var qryInsert = "IF NOT EXISTS (SELECT * FROM [app].[Guest] " +
        "WHERE RegistrationID = \'%s\' AND " +
        "ISNULL(ServiceUsed, 0) = 0 AND " +
        "ServiceType = N\'%s'\ AND " +
        "GuestPhoneNumber =  \'%s\') " +
        "BEGIN " +
        "insert into [app].[Guest] " +
        "VALUES (\'%s\', \'%s\', N\'%s\', \'%s\', %s, %s, %s, \'%s\', \'%s\', 0, NULL)  " +
        "END " +
        "ELSE " +
        "BEGIN " +
        "UPDATE [app].[Guest] " +
        "SET MembershipFileID = \'%s\', " +
        "StartDate = \'%s\', " +
        "ExpireDayCount = %s, " +
        "PermissionCreditUse = %s, " +
        "GuestCount = %s, " +
        "CodeNumber = \'%s'\, " +
        "ServiceType = N\'%s'\ " +
		 "WHERE RegistrationID = \'%s\' AND " +
        "ISNULL(ServiceUsed, 0) = 0 AND " +
        "ServiceType = N\'%s'\ AND " +
        "GuestPhoneNumber =  \'%s\' "  +
        "END";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryInsert,
            RegistrationID,
            ServiceType,
            GuestPhoneNumber,
            MembershipFilID,
            RegistrationID,
            ServiceType,
            formatted,
            GuestExpireCount,
            IsCredit,
            GuestCount,
            GuestPhoneNumber,
            ActivationCode,
            MembershipFilID,
            formatted,
            GuestExpireCount,
            IsCredit,
            GuestCount,
            ActivationCode,
            ServiceType,
			RegistrationID,
            ServiceType,
            GuestPhoneNumber
        ), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }

            if (recordset.rowsAffected.length = 1) {

                sql.close();
                var Kavenegar = require('kavenegar');
                var api = Kavenegar.KavenegarApi({
                    apikey: "4562754155412F7A754A507A383174387253324746413D3D"
                });
                api.VerifyLookup({
                    receptor: GuestPhoneNumber,
                    token: ActivationCode,
                    template: "guest"
                }, function (response, status) {
                    console.log(response);
                    console.log(status);
                    Status = (status == 200);

                    if (Status) {
                        res.send({status: Status, "errmessage": ""});
                        res.end();
                        return;
                    }
                    else {
                        res.send({
                            status: Status,
                            "errmessage": "خطا در ارسال پیامک. لطفا در ساعاتی دیگر مجددا تلاش فرمایید"
                        });
                        res.end();
                        return;
                    }
                });
            }
        });
    });
});

module.exports = router;
