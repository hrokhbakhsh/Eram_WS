var express = require('express');
var router = express.Router();
var rn = require('random-number');
var dateTime = require('node-datetime');
var app = require('../app').con;
var db = require('../public/db');
var sql = require('mssql');
var nowDate;
var formatted;
var afterOneHours;
var formattedExpire;
var Status;

var gen = rn.generator({
    min: 121000
    , max: 999987
    , integer: true
});

router.post('/', function (req, res, next) {
    nowDate = dateTime.create();
    formatted = nowDate.format('Y-m-d H:M:S');
    afterOneHours = dateTime.create();
    // 1 hour in the future
    afterOneHours.offsetInHours(1);
    formattedExpire = afterOneHours.format('Y-m-d H:M:S');
    console.log(formatted);

    var phone = req.body.phone;
    var StoreCode = req.body.store_code;

    var firstNumber = phone.substring(0, 2);
    Status = (firstNumber === "09" || phone.toString().length === 11)
    if (!Status) {
        res.send({status: Status, "errmessage": "شماره موبایل وارد شده صحیح نیست"});
        res.end();
        return;
    }


    var qryString = "SELECT top (1) " +
    "u.id AS UserID, " +
    "u.PhoneNumber, " +
    "u.PersonName, " +
    "s.Code AS StoreCode, " +
    "s.Name AS StoreName, " +
    "u.Password " +
    "FROM " +
    "rst.users AS u " +
    "LEFT JOIN rst.Store AS s ON (u.StoreID = s.id) " +
    "WHERE " +
    "u.PhoneNumber = \'%s\' AND " +
    "s.Code = \'%s\' ; ";

    var qryInsert = "IF NOT EXISTS (SELECT * FROM [rst].[Tmp_ActivationCode] " +
        "WHERE PhoneNumber = \'%s\' AND " +
        "CreatedDateTime <= \'%s\' AND " +
        "ExpirationDateTime >= \'%s\' AND used = 0) " +
        "BEGIN " +
        "insert into [rst].[Tmp_ActivationCode] " +
        "VALUES (\'%s\', %s, \'%s\', \'%s\', 0, %s) " +
        "END ";

    var qryGetActivationCode = "SELECT top (1) ActivationCode FROM [rst].[Tmp_ActivationCode] " +
        "WHERE PhoneNumber = \'%s\' AND CreatedDateTime <= \'%s\' AND ExpirationDateTime >= \'%s\' AND used = 0";

    sql.connect(db, function (err) {
        var request = new sql.Request();

        request.query(util.format(qryString, phone, StoreCode), function (err, recordset) {

            if (err) {
                res.send({status: false, "errmessage": err});
                sql.close();
                res.end();
                return;
            }
            if (recordset.recordset.length > 0) {
                var DBUserID = recordset.recordset[0].UserID.toString();
                var DBPhoneNumber = recordset.recordset[0].PhoneNumber.toString();
                var DBStoreCode = recordset.recordset[0].StoreCode.toString();
                var DBPersonName = recordset.recordset[0].PersonName.toString();
                var DBStoreName = recordset.recordset[0].StoreName.toString();

                var activateionCode = gen();
            }
            else {
                res.send({
                    status: false,
                    "errmessage": "شماره تلفن همراه با کد مرکز ثبت شده در سامانه مطابقت ندارد. لطفا با واحد پشتیبانی تماس حاصل نمایید"
                });
                res.end();
                sql.close();
                return;

            }
            request.query(util.format(qryInsert, phone, formatted, formatted, phone, activateionCode, formatted, formattedExpire, DBUserID), function (err, recordset) {

                if (err) {
                    res.send({status: false, "errmessage": err});
                    sql.close();
                    res.end();
                    return;
                }

                request.query(util.format(qryGetActivationCode, phone, formatted, formatted), function (err, recordset) {

                        if (err) {
                            res.send({status: false, "errmessage": err});
                            sql.close();
                            res.end();
                            return;
                        }
                        if (recordset.recordset.length > 0) {

                            var GetActivationCode = recordset.recordset[0].ActivationCode.toString();
                            sql.close();
                            var Kavenegar = require('kavenegar');
                            var api = Kavenegar.KavenegarApi({
                                apikey: "4562754155412F7A754A507A383174387253324746413D3D"
                            });
                            api.VerifyLookup({
                                receptor: phone,
                                token: GetActivationCode,
                                template: "verify"
                            }, function (response, status) {
                                console.log(response);
                                console.log(status);
                                Status = (status == 200);


                                // var Kavenegar = require('kavenegar');
                                // var api = Kavenegar.KavenegarApi({
                                //     apikey: "4562754155412F7A754A507A383174387253324746413D3D"
                                // });
                                // api.Send({
                                //         message: "کد فعالسازی در مجموعه ورزشی هتل ارم:" + "\n" + GetActivationCode,
                                //         sender: "1000002967",
                                //         receptor: phone
                                //     },
                                //     function (response, status) {
                                //         console.log(response);
                                //         console.log(status);
                                //         Status = (status == 200);
                                //     });

                                if (Status) {
                                    res.send({status: Status, "errmessage": ""});
                                    res.end();
                                }
                                else {
                                    res.send({
                                        status: Status,
                                        "errmessage": "خطا در ارسال پیامک. لطفا در ساعاتی دیگر مجددا تلاش فرمایید"
                                    });
                                    res.end();
                                }
                            });
                        }

                        else {
                            res.send({
                                status: false,
                                "errmessage": "خطا در ارسال کد فعالسازی. لطفا مجددا اقدام نمایید"
                            });
                            sql.close();
                            res.end();
                            return;
                        }
                    }
                );
            });
        });
    });
});
module.exports = router;
