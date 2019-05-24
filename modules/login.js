var db = require('../db/db.js').mysql;
const joi = require('@hapi/joi');
const crypto = require("../tools/crypto.js"); 
const jwt = require('jsonwebtoken');

const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(20).required(),
    password: joi.string().alphanum().required()
})

function login(username, password, callback){
    var token;
    joi.validate({username: username, password: password}, schema, (err, res)=>{
        if(err){
            console.error(err);
            callback({message:"Input error!", err:err})
            return;
        }
        var sqlQuery = "SELECT password FROM crowd.Member WHERE Username='"+username+"';";
        db.query(sqlQuery,(err, res, fields)=>{
            if(err){
                console.error(err);
                callback({message: "Database error!", err:err},false);
                return;
            }
            crypto.validate(password, res[0].password,(err, equal)=>{
                if(err){
                    console.error(err);
                    callback({message: "error in checking password", err:err}, false);
                    return;
                }
                if(equal){
                    token = jwt.sign({data:{username:username},exp:Math.floor(Date.now()/1000+(60*60))}, process.env.JWT_SECRET)
                }
                callback(null, {success: equal, token: token});
                return;
            });
        });
    });
}
module.exports.login = login;