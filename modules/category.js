const db = require('../db/db').mysql;
const joi = require('@hapi/joi');

const schema = joi.object().keys({
    username: joi.string().alphanum().min(3).max(20).required(),
    MainID: joi.number(),
    SubID: joi.number(),
    SubSubID: joi.number()
})

function addInterest(username, values, callback){
    joi.validate({username: username, MainID: values.mainID, SubID: values.subID, SubSubID: values.subSubID}, schema, (err, res)=>{
        if(err){
            console.error(err);
            callback({message:"Input error!", err:err})
            return;
        }
        if(values.mainID!=undefined){
            addMainInterest(username, values.mainID, callback);
            return;
        }
        if(values.subID!=undefined){
            addSubInterest(username, values.subID, callback);
            return;
        }
        if(values.subSubID!=undefined){
            addSubSubInterest(username, values.subSubID, callback);
            return;
        }
        callback({message: "no interest provided"}, false);
        return;
    });
}

function addMainInterest(username, id, callback){
    var sqlQuery = "SELECT uuid FROM crowd.Member WHERE Username='"+username+"';";
    getUUID(username, (err, res)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        console.log(res);
        var interestQuery = "INSERT INTO crowd.Member_Interests (MemberUUID, MainCategoryID) VALUES('"+res.uuid+"', '"+id+"')";
        db.query(interestQuery,(err, res, fields)=>{
            if(err){
                console.error(err);
                callback({message: "Database error!", err:err},false);
                return;
            }
            callback(null, true);
            return;
        })
    })
}
function addSubInterest(username, id, callback){
    var sqlQuery = "SELECT uuid FROM crowd.Member WHERE Username='"+username+"';";
    getUUID(username, (err, res)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        console.log(res);
        var interestQuery = "INSERT INTO crowd.Member_Interests (MemberUUID, MainCategoryID) VALUES('"+res.uuid+"', '"+id+"')";
        db.query(interestQuery,(err, res, fields)=>{
            if(err){
                console.error(err);
                callback({message: "Database error!", err:err},false);
                return;
            }
            callback(null, true);
            return;
        })
    })
}

function getUUID(username, callback){
    var sqlQuery = "SELECT UUID FROM crowd.Member WHERE Username='"+username+"';";
    db.query(sqlQuery,(err, res, fields)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        callback(null, {uuid: res[0].UUID});
    });
}

module.exports.addInterest = addInterest;