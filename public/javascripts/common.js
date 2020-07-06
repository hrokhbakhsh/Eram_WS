var express = require('express');
var router = express.Router();
const apn = require('apn');
var dateTime = require('node-datetime');
var app = require('../../app').con;
var msg;
var NameUser;
var registrationTokenUser;
var ConfirmManager;
var AcceptedTitle;

let absolutePath = 'D:/AuthKey_Y3595L9N32.p8';
let options = {
    token:  {
        key: absolutePath,
        keyId: "Y3595L9N32",
        teamId: "97L5T88BV5"

    },
    production: true
};


module.exports = {
    SendEvaluationNotify: function (TokenKey, UsedDate, DeviceType) {

        msg = util.format("نظر سنجی از سرویس ورزشی هتل ارم در تاریخ \'%s\' ", UsedDate);
         if (DeviceType == '1') {
             var registrationToken = [];
        	console.log("android");

            var payload = {
                data: {
                    score: "850",
                    time: "24:00",
                    message: msg,
                    ldate: UsedDate,
                    type: "1"
                }
            };
                   registrationToken = TokenKey;

            admin.messaging().sendToDevice(registrationToken, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

        } else if (DeviceType == '2') {
            console.log("IOS");

            let apnProvider = new apn.Provider(options);

            console.log(TokenKey);
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 24 * 3600;
            note.badge = 1;
            note.sound = "noti.mp3";
            note.alert = "لطفا نظر خود را در خصوص خدمات ارائه شده در مجموعه ورزشی هتل بزرگ ارم ارائه فرمایید";
            note.payload = {'messageFrom': 'Grand Hotel Eram', 'Type':'1'};
            note.topic = "com.sport.hotel";

            apnProvider.send(note, TokenKey).then( (response) => {
                console.log('Done');

                 if (response.sent.length > 0) {
                     console.log(response.sent[0]);
                     console.log('Notification Send Successfuly ');
                 }
                 if (response.failed.length > 0) {
                     console.log(response.failed[0]);
                     console.log('Notification Can Not Send ');
                 }
                 apnProvider.shutdown();
            });
        }


    },
    SendMessageToManyUserNotify: function (Records, message) {
        for (var i = 0; i < Records.length; i++) {

            var TokenKey = Records[i].TokenKey;
            var DeviceType = Records[i].DeviceType;

            if (DeviceType == '1') {

                var registrationTokens = [];

                var payload = {
                    data: {
                        score: "850",
                        time: "24:00",
                        message: message,
                        type: "3"
                    }
                };
                registrationTokens = TokenKey;

                admin.messaging().sendToDevice(registrationTokens, payload)
                    .then(function (response) {
                        console.log("Successfully sent message:", response);
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                    });

            } else if (DeviceType == '2') {
                console.log("IOS");
                let apnProvider = new apn.Provider(options);
                console.log(TokenKey);

                var note = new apn.Notification();
                note.expiry = Math.floor(Date.now() / 1000) + 24 * 3600;
                note.badge = 1;
                note.sound = "noti.mp3";
                note.alert = message;
                note.payload = {'messageFrom': 'Grand Hotel Eram', 'Type':'2'};
                note.topic = "com.sport.hotel";

                apnProvider.send(note, TokenKey).then( (response) => {
                    console.log('Done');

                    if (response.sent.length > 0) {
                        console.log(response.sent[0]);
                        console.log('Notification Send Successfuly ');
                    }
                    if (response.failed.length > 0) {
                        console.log(response.failed[0]);
                        console.log('Notification Can Not Send ');
                    }
                    apnProvider.shutdown();
                });

            }
        }
    }
};
