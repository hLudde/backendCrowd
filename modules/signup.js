var db = require('../db/db.js').mysql;
const joi = require('@hapi/joi');
const crypto = require("../tools/crypto.js"); 


const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(20).required(),
    password: joi.string().alphanum().required(),
    email: joi.string().email().required().max(40),
    name: joi.string().regex(/^[a-zA-Z0-9 ]*$/)
})
/*
Brukernavn, Navn, Epost, password
*/
function RegisterAccount(username, name, email, password, callback){
    joi.validate({username: username, password: password, email: email, name: name},schema,(err, res)=>{
        if(err){
            console.error(err);
            callback({message:"Input error", err:err}, false);
            return;
        }
        crypto.encrypt(password, 12, (err, hash)=>{
            if(err){
                callback({message: "Error hashing password!", err:err}, false);
                return;
            }
            var sqlQuery = "INSERT INTO crowd.Member (Username, FirstName, LastName, Email, Password) VALUES('"+username+"','"+name+"','"+name+"','"+email+"','"+hash+"')"
            db.query(sqlQuery,(err)=>{
                if(err){
                    console.error(err);
                    callback({message: "Error with database!", err:err}, false);
                    return;
                }
                callback(null, true)
                return;
            });
        });
    });
}

module.exports.RegisterAccount = RegisterAccount;