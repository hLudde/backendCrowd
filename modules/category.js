const db = require('../db/db').mysql;
const joi = require('@hapi/joi');

const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(20).required(),
    
})

function addInterest(username, values, callback){
    joi.validate({username: username}, schema, (err, res)=>{
        if(err){
            console.error(err);
            callback({message:"Input error!", err:err})
            return;
        }
        var sqlQuery = "SELECT UUID, Username, FirstName, LastName, PhoneNumber, Email, School, ProfileImage FROM crowd.Member WHERE Username='"+username+"';";
        db.query(sqlQuery,(err, res, fields)=>{
            if(err){
                console.error(err);
                callback({message: "Database error!", err:err},false);
                return;
            }
            callback(null, {username: res[0].Username, firstname: res[0].FirstName, lastname: res[0].LastName, phonenumber: res[0].PhoneNumber, email: res[0].Email, school: res[0].School, profileimage: res[0].ProfileImage});
        });
    });
}
module.exports.profile = profile;