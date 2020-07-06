var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    var AndroidVersion = "15";
    var AndroidFilePath = "http://satakco.com/Eram.apk";
    var iOSVersion = "2.5.0";
    var iOSFilePath = "http://www.google.com";
    res.send({AndroidVersion : AndroidVersion, AndroidFilePath: AndroidFilePath, iOSVersion: iOSVersion, iOSFilePath: iOSFilePath});
    res.end();
});
module.exports = router;