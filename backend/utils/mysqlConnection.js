"use strict";
const mysql = require("mysql");
const { mysqlHost, mysqlUser, mysqlPassword, mysqlDatabase } = require("./config")
const myPort = 3306;

const pool = mysql.createPool({
    connectionLimit: 100,
    host: mysqlHost,
    user: mysqlUser,
    port: myPort,
    password: mysqlPassword,
    database: mysqlDatabase,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
});

pool.getConnection((err) => {
    if (err) {
        throw 'Error occured: ' + err;
    } else {
        console.log("SQL Database Connected");
    }
});

module.exports = pool;