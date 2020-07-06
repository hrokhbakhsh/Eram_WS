/**
 * Created by Farzam_PC on 10/11/2017.
 */

var express = require('express');
con = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: '192.168.120.7',
    port:1433,
    database: 'AppFrameworkEramDB',
    debug: true,
    requestTimeout: 60000,
    connectionTimeout: 50000,
    options: {
         tdsVersion: '7_3_B'
        ,instanceName: 'SQL2017'
    },
    pool: {
        max: 1024,
        min: 10,
        idleTimeoutMillis: 50000
    }
};

module.exports = con;