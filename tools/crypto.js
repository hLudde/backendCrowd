const bcrypt = require('bcrypt');

function encrypt(password, saltRounds, callback){
    bcrypt.hash(password, saltRounds,(err, hash)=>{
        if(err){
            console.error(err);
            callback("Error generating salt", null);
            return;
        }
        callback(null, hash);
    })
}

function validate(password, hash, callback){
    bcrypt.compare(password, hash, (err, equal)=>{
        if(err){
            return;
        }
        callback(null, equal)
    })
}

module.exports.encrypt = encrypt;
module.exports.validate = validate;