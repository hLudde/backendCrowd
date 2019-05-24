var db = require('../db/db.js').mysql;
const joi = require('@hapi/joi');
const crypto = require("../tools/crypto.js"); 
const jwt = require('jsonwebtoken');

const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(20).required(),
    password: joi.string().alphanum(),
    email: joi.string().email().max(40),
    name: joi.string().regex(/^[a-zA-Z-øæåØÆÅ ]*$/).max(140).allow(''),
    school: joi.string().regex(/^[a-zA-Z0-9-øæåØÆÅ ]*$/).max(40).allow(''),
    phoneNumber: joi.string().regex(/^[+0-9- ]*$/).max(20).allow('')
})

function edit(values, username, callback){
    /*var token;*/
    joi.validate({username: username, password: values.password, email: values.email, name: values.name, school: values.school, phoneNumber: values.phone}, schema, (err, res)=>{
        if(err){
            console.error(err);
            callback({message:"Input error!", err:err}, false)
            return;
        }
        var sqlQuery = "UPDATE crowd.Member SET";
        var changed = false;
        if(values.password!=null||values.password!=undefined){
            crypto.encrypt(values.password, 12, (err, hash)=>{
                if(err){
                    callback({message:"Error hashing password", err:err}, false);
                    console.log(err);
                    return;
                }
                sqlQuery+=" Password='"+hash+"',"
                sqlQuery += queryBuilder(values);
                sqlQuery += " WHERE Username='"+username+"';";
                queryExec(sqlQuery, callback);
            })
        }else{
            sqlQuery += queryBuilder(values);
            if(sqlQuery.length<24){
                callback(null, true);
                return;
            }
            sqlQuery += " WHERE Username='"+username+"';";
            queryExec(sqlQuery, callback);
        }
    });
}

function queryExec(query, callback){
    db.query(query,(err, res, fields)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        callback(null, true);
        return;
    });
}

function queryBuilder(values){
    var query  = '';
    if(values.email!=null||values.email!=undefined){
        query += " Email='"+values.email+"',";
    }
    if(values.name!=null||values.name!=undefined){
        query += " Name='"+values.name+"',";
    }
    if(values.school!=null||values.school!=undefined){
        query += " School='"+values.school+"',";
    }
    if(values.phone!=null||values.phone!=undefined){
        query += " phoneNumber='"+values.phone+"',"
    }
    query = query.substr(0,query.length-1);
    return query;
}
module.exports.edit = edit;