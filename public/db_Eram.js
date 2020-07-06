/**
 * Created by Farzam_PC on 10/11/2017.
 */

var express = require('express');
con = {
    user: 'sa',
    password: 'Champion1',
    server: '192.168.120.7',
    port:0,
    database: 'AppFrameworkEramDB',
    debug: true,
    options: {
        encrypt: false // Use this if you're on Windows Azure
        ,instanceName: 'TARAZ2008'
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000
    }
};


module.exports = con;