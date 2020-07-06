var express = require('express');
var router = express.Router();
var app = require('../app').con;
var Status;

router.post('/', function (req, res, next) {
    var PhoneNumber = req.body.phone_number;
    var Messsages = req.body.messages;


    var Kavenegar = require('kavenegar');
    var api = Kavenegar.KavenegarApi({
        apikey: "4562754155412F7A754A507A383174387253324746413D3D"
    });
    api.Send({
            message: Messsages,
            sender: "1000002967",
            receptor: PhoneNumber
        },
        function (response, status) {
            console.log(response);
            console.log(status);
            Status = (status == 200);
            res.send(Status);
            res.end();
            return;
        });

});
module.exports = router;