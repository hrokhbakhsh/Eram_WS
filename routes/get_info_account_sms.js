var express = require('express');
var router = express.Router();
var app = require('../app').con;
var Status;

router.post('/', function (req, res, next) {
    var API_Key = req.body.api_key;

    var https = require('https');
    var options = {
        host: 'api.kavenegar.com',
        path:util.format('/v1/%s/account/info.json', API_Key)
    };

    var req = https.get(options, function (result) {
        var bodyChunks = [];
        result.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            res.send(body);
            res.end();
            return;
        })

    });

    req.on('error', function (e) {
        res.send(e.message);
        res.end();
        return;

    });




});
module.exports = router;



