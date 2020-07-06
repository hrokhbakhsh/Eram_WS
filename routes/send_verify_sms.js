var express = require('express');
var router = express.Router();

var Status;

router.post('/', function (req, res, next) {

    var PhoneNumber = req.body.phone;
    var Token1 = req.body.token1;
    var Token2 = req.body.token2;
    var Token3 = req.body.token3;
    var Token10 = req.body.member_code;
	var Token20 = req.body.org_name;
    var APIKey =req.body.api_key;
    var TemplateName = req.body.template_name;

    var Kavenegar = require('kavenegar');
    var api = Kavenegar.KavenegarApi({
        apikey: APIKey
    });
    api.VerifyLookup({
        receptor: PhoneNumber,
        token: Token1,
        token2: Token2,
        token3: Token3,
        token10: Token10,
		token20: Token20,
        template: TemplateName

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

});

module.exports = router;