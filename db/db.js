var mysql = require('mysql');
var fs = require('fs');

var clientCert = fs.readFileSync(__dirname+"/certs/client-cert.pem",({encoding:"utf-8"}));
var clientKey = fs.readFileSync(__dirname+"/certs/client-key.pem",({encoding:"utf-8"}));
var serverCa = fs.readFileSync(__dirname+"/certs/server-ca.pem",({encoding:"utf-8"}));

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: {
        cert: clientCert,
        key: clientKey,
        ca: serverCa
    }
})

con.ping({},(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("The Crowd API is connected to DB!");
})

module.exports.mysql = con