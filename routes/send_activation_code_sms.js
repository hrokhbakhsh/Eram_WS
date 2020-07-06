var express = require('express');
var router = express.Router();

var Status;

router.post('/', function (req, res, next) {

    var PhoneNumber = req.body.phone;
    var ActiveCode = req.body.code;


    var Kavenegar = require('kavenegar');
    var api = Kavenegar.KavenegarApi({
        apikey: "54745A6849524564384441474438727050357741366C65324F797249642B66424C663765364175664A63493D"
    });
    api.VerifyLookup({
        receptor: PhoneNumber,
        token: ActiveCode,
        token2:"8",
        token3:"1398/07/06",
        template:"SessionalExit"

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