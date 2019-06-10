const db = require('../db/db').mysql;
const joi = require('@hapi/joi');
const group = require('./group');

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
            group.createGroup(0, values.MainID);
            return;
        }
        if(values.subID!=undefined){
            addSubInterest(username, values.subID, callback);
            group.createGroup(1, values.subID);
            return;
        }
        if(values.subSubID!=undefined){
            addSubSubInterest(username, values.subSubID, callback);
            group.createGroup(2, values.subSubID);
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

function addSubInterest(username, subID, callback){
    var sqlQuery = "SELECT uuid FROM crowd.Member WHERE Username='"+username+"';";
    getUUID(username, (err, res)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        console.log(res);
        var selectMainIDQuery = "SELECT MainCategoryID FROM crowd.Sub_Category WHERE ID='"+subID+"';";
        db.query(selectMainIDQuery,(err,res2, fields)=>{
            var interestQuery = "INSERT INTO crowd.Member_Interests (MemberUUID, MainCategoryID, SubCategoryID) VALUES('"+res.uuid+"', '"+res2[0].MainCategoryID+"', '"+subID+"')";
            db.query(interestQuery,(err, res3, fields)=>{
                if(err){
                    console.error(err);
                    callback({message: "Database error!", err:err},false);
                    return;
                }
                callback(null, true);
                return;
            })
        })
    })
}

function addSubSubInterest(username, subSubID, callback){
    var sqlQuery = "SELECT uuid FROM crowd.Member WHERE Username='"+username+"';";
    getUUID(username, (err, res)=>{
        if(err){
            console.error(err);
            callback({message: "Database error!", err:err},false);
            return;
        }
        console.log(res);
        var selectSubIDQuery = "SELECT SubCategoryID FROM crowd.Sub_Sub_Category WHERE ID='"+subSubID+"';";
        db.query(selectSubIDQuery,(err,res2, fields)=>{
            var selectMainIDQuery = "SELECT MainCategoryID FROM crowd.Sub_Category WHERE ID='"+res2[0].SubCategoryID+"';";
            db.query(selectMainIDQuery,(err, res3, fields)=>{
                var interestQuery = "INSERT INTO crowd.Member_Interests (MemberUUID, MainCategoryID, SubCategoryID, SubSubCategoryID) VALUES('"+res.uuid+"', '"+res3[0].MainCategoryID+"', '"+res2[0].SubCategoryID+"', '"+subSubID+"')";
                db.query(interestQuery,(err, res4, fields)=>{
                    if(err){
                        console.error(err);
                        callback({message: "Database error!", err:err},false);
                        return;
                    }
                    callback(null, true);
                    return;
                })
            })
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

function getRandomCategory(username, callback){
    getUUID(username, (err0, res)=>{
        if(err0){
            console.error(err0);
            callback({message: "Database error!", err:err0},false);
            return;
        }
        console.log("got uuid "+res.uuid);
        var sumOfMainCategories = 'SELECT ID FROM crowd.Main_Category'
        db.query(sumOfMainCategories, (err1, res1, fields)=>{
            if(err1){
                console.error(err1);
                callback({message: "Database error!", err:err1},false);
                return;
            }
            console.log("got id's of main")
            var sumOfSubCategories = 'SELECT ID FROM crowd.Sub_Category'
            db.query(sumOfSubCategories, (err2, res2, fields)=>{
                if(err2){
                    console.error(err2);
                    callback({message: "Database error!", err:err2},false);
                    return;
                }
                console.log("got id's of sub")
                var sumOfSubSubCategories = 'SELECT ID FROM crowd.Sub_Sub_Category'
                db.query(sumOfSubSubCategories, (err3, res3, fields)=>{
                    if(err3){
                        console.error(err3);
                        callback({message: "Database error!", err:err3},false);
                        return;
                    }
                    console.log("got id's of subsub")
                    var searchAgain = true;
                    while(searchAgain){
                        searchAgain = false;
                        var id = Math.floor(Math.random()*(res1.length+res2.length+res3.length))+1;
                        console.log(id);
                        if(id<=res1.length){
                            var Category = "SELECT * FROM crowd.Main_Category WHERE ID = '"+id+"'";
                            db.query(Category, (err4, res4, fields)=>{
                                if(err4){
                                    console.error(err4);
                                    callback({message: "Database error!", err:err4},false);
                                    return;
                                }
                                var isAlreadyInterested = "SELECT * FROM crowd.Member_Interests WHERE MemberUUID = '"+res.uuid+"' AND MainCategoryID ='"+id+"'";
                                db.query(isAlreadyInterested, (err5, res5, fields)=>{
                                    console.log("hello world!")
                                    if(err5){
                                        console.error(err5);
                                        callback({message: "Database error!", err:err5},false);
                                        return;
                                    }
                                    console.log("the length of res5: "+res5.length);
                                    if(res5.length<=0){
                                        console.log("selected a main")
                                        callback(null, res4[0])
                                        return;
                                    }
                                    searchAgain = true;
                                })
                            })
                        }else if(id<=(res1.length+res2.length)){
                            id -= res1.length;
                            var Category = "SELECT * FROM crowd.Sub_Category WHERE ID = '"+id+"'";
                            db.query(Category, (err4, res4, fields)=>{
                                if(err4){
                                    console.error(err4);
                                    callback({message: "Database error!", err:err4},false);
                                    return;
                                }
                                var isAlreadyInterested = "SELECT * FROM crowd.Member_Interests WHERE MemberUUID = '"+res.uuid+"' AND SubCategoryID ='"+id+"'";
                                db.query(isAlreadyInterested, (err5, res5, fields)=>{
                                    if(err5){
                                        console.error(err5);
                                        callback({message: "Database error!", err:err5},false);
                                        return;
                                    }
                                    if(res5.length<=0){
                                        console.log("selected a sub")
                                        callback(null, res4[0])
                                        return;
                                    }
                                    searchAgain = true;
                                })
                            })
                        }else if(id<=(res1.length+res2.length+res3.length)){
                            id = id-(res1.length+res2.length);
                            var Category = "SELECT * FROM crowd.Sub_Sub_Category WHERE ID = '"+id+"'";
                            db.query(Category, (err4, res4, fields)=>{
                                if(err4){
                                    console.error(err4);
                                    callback({message: "Database error!", err:err4},false);
                                    return;
                                }
                                var isAlreadyInterested = "SELECT * FROM crowd.Member_Interests WHERE MemberUUID = '"+res.uuid+"' AND SubSubCategoryID ='"+id+"'";
                                db.query(isAlreadyInterested, (err5, res5, fields)=>{
                                    if(err5){
                                        console.error(err5);
                                        callback({message: "Database error!", err:err5},false);
                                        return;
                                    }
                                    if(res5.length<=0){
                                        console.log("selected a subsub")
                                        callback(null, res4[0])
                                        return;
                                    }
                                    searchAgain = true;
                                })
                            })
                        }else{
                            callback({message: "Database error!", err:"id doesnt exist"},false);
                            return;
                        }
                    }
                })
            })
        })
    })
}

module.exports.addInterest = addInterest;
module.exports.getRandomCategory = getRandomCategory;