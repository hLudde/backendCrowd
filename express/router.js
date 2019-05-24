var app = require("./server").expressApp;
var signup = require("../modules/signup.js");
var login = require("../modules/login.js");
var chat = require("../modules/chat.js");
var profile = require("../modules/profile.js");
var edit = require("../modules/edit.js");

app.post("/register",(req,res)=>{
    signup.RegisterAccount(req.body.username, req.body.name, req.body.email, req.body.password, (err, success)=>{
        if(err){
            res.send(err.message);
            return;
        }
        res.json({success: success});
        return;
    });
})

app.post("/login",(req,res)=>{
    login.login(req.body.username, req.body.password, (err, result)=>{
        res.json(result)   
    })
})

app.post("/user/profile",(req,res)=>{
    edit.edit(req.body, req.body.username, (err, result)=>{
        if(err){
            res.json(err)
            return;
        }
        res.json(result)   
    })
})

app.get("/echo",(req,res)=>{
    res.send("Hello World!");
})

app.get('/user/profile', function(req, res){
    profile.profile(req.body.username, (err, result)=>{
        if(err){
            res.send(err.message);
            return;
        }
        res.json(result);
        return;
    })
})