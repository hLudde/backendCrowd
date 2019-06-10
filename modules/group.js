const db = require('../db/db').mysql;
const joi = require('@hapi/joi');
require('dotenv').config();

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

module.exports.getGroups = (username, callback) =>{
    getUUID(username, (err, res)=>{
        var query = "SELECT * FROM crowd.Groups WHERE UUID = (SELECT GroupUUID FROM crowd.Group_Member WHERE MemberUUID = '"+res.uuid+"')";
        db.query(query, (err, res, fields)=>{
            if(err){
                console.log(err);
                callback(err, {sucess:false});
                return;
            }
            callback(null, res);
        })
    })
}

module.exports.createGroup = (categoryType, id)=>{
    if(Math.floor(Math.random()*101)>50){
        if(categoryType==0){
            var query = "SELECT DISTINCT MemberUUID FROM crowd.Member_Interests WHERE MainCategoryID = '"+id+"' AND MemberUUID NOT IN (select MemberUUID FROM crowd.Group_Member WHERE GroupUUID in (SELECT UUID FROM crowd.Groups WHERE CategoryName in (SELECT Name FROM crowd.Main_Category WHERE ID = '"+id+"')));";
            var interestName = "SELECT Name FROM crowd.Main_Category WHERE ID = '"+id+"'";
            db.query(query, (err, res, fields)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(res.length<2){
                    return;
                }
                db.query(interestName, (err2,res2,fields)=>{
                    if(err2){
                        console.log(err2);
                        return;
                    }
                    var createGroupQuery = "INSERT INTO crowd.Groups (NumberOfMembers, CategoryName) VALUES ('"+res.length+"', '"+res2[0].Name+"');";
                    db.query(createGroupQuery, (err3, res3, fields3)=>{
                        if(err3){
                            console.log(err3);
                            return;
                        }
                        var selectQuery =  "SELECT UUID FROM crowd.Groups ORDER BY UUID DESC LIMIT 1;";
                        db.query(selectQuery, (err4,res4, fields)=>{
                            console.log("made a group!");
                            for(var i = 0; i<res.length; i++){
                                var addUserToGroup = "INSERT INTO crowd.Group_Member (GroupUUID, MemberUUID) VALUES ('"+res4[0].UUID+"', '"+res[i].MemberUUID+"')";
                                db.query(addUserToGroup, (err5, res5, fields)=>{
                                    if(err5){
                                        console.log(err5);
                                        return;
                                    }
                                    console.log("added user to group "+res4[0].UUID);
                                    return;
                                })
                            }
                        })
                    })
                })
            }) 
        } else if(categoryType==1){
            var query = "SELECT DISTINCT MemberUUID FROM crowd.Member_Interests WHERE SubCategoryID = '"+id+"' AND MemberUUID NOT IN (select MemberUUID FROM crowd.Group_Member WHERE GroupUUID in (SELECT UUID FROM crowd.Groups WHERE CategoryName in (SELECT Name FROM crowd.Sub_Category WHERE ID = '"+id+"')));";
            var interestName = "SELECT Name FROM crowd.Sub_Category WHERE ID = '"+id+"'";
            db.query(query, (err, res, fields)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(res.length<2){
                    return;
                }
                db.query(interestName, (err2,res2,fields)=>{
                    if(err2){
                        console.log(err2);
                        return;
                    }
                    var createGroupQuery = "INSERT INTO crowd.Groups (NumberOfMembers, CategoryName) VALUES ('"+res.length+"', '"+res2[0].Name+"');";
                    db.query(createGroupQuery, (err3, res3, fields3)=>{
                        if(err3){
                            console.log(err3);
                            return;
                        }
                        var selectQuery =  "SELECT UUID FROM crowd.Groups ORDER BY UUID DESC LIMIT 1;";
                        db.query(selectQuery, (err4,res4, fields)=>{
                            console.log("made a group!");
                            for(var i = 0; i<res.length; i++){
                                var addUserToGroup = "INSERT INTO crowd.Group_Member (GroupUUID, MemberUUID) VALUES ('"+res4[0].UUID+"', '"+res[i].MemberUUID+"')";
                                db.query(addUserToGroup, (err5, res5, fields)=>{
                                    if(err5){
                                        console.log(err5);
                                        return;
                                    }
                                    console.log("added user to group "+res4[0].UUID);
                                    return;
                                })
                            }
                        })
                    })
                })
            })
        } else if(categoryType==2){
            var query = "SELECT DISTINCT MemberUUID FROM crowd.Member_Interests WHERE SubSubCategoryID = '"+id+"' AND MemberUUID NOT IN (select MemberUUID FROM crowd.Group_Member WHERE GroupUUID in (SELECT UUID FROM crowd.Groups WHERE CategoryName in (SELECT Name FROM crowd.Sub_Sub_Category WHERE ID = '"+id+"')));";
            var interestName = "SELECT Name FROM crowd.Sub_Sub_Category WHERE ID = '"+id+"'";
            db.query(query, (err, res, fields)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(res.length<2){
                    return;
                }
                db.query(interestName, (err2,res2,fields)=>{
                    if(err2){
                        console.log(err2);
                        return;
                    }
                    var createGroupQuery = "INSERT INTO crowd.Groups (NumberOfMembers, CategoryName) VALUES ('"+res.length+"', '"+res2[0].Name+"');";
                    db.query(createGroupQuery, (err3, res3, fields3)=>{
                        if(err3){
                            console.log(err3);
                            return;
                        }
                        var selectQuery =  "SELECT UUID FROM crowd.Groups ORDER BY UUID DESC LIMIT 1;";
                        db.query(selectQuery, (err4,res4, fields)=>{
                            console.log("made a group!");
                            for(var i = 0; i<res.length; i++){
                                var addUserToGroup = "INSERT INTO crowd.Group_Member (GroupUUID, MemberUUID) VALUES ('"+res4[0].UUID+"', '"+res[i].MemberUUID+"')";
                                db.query(addUserToGroup, (err5, res5, fields)=>{
                                    if(err5){
                                        console.log(err5);
                                        return;
                                    }
                                    console.log("added user to group "+res4[0].UUID);
                                    return;
                                })
                            }
                        })
                    })
                })
            })
        }
        console.log("truthy");
    }else{
        console.log("falsy");
    }
}