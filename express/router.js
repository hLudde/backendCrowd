var app = require("./server").expressApp;
var signup = require("../modules/signup.js");
var login = require("../modules/login.js");
var chat = require("../modules/chat.js");
var profile = require("../modules/profile.js");
var edit = require("../modules/edit.js");
var interest = require("../modules/category.js")
var group = require("../modules/group.js");


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

app.post("/user/interest",(req,res)=>{
    interest.addInterest(req.body.username, req.body, (err, result)=>{
        if(err){
            res.json(err)
            return;
        }
        res.send(result);
    })
});

app.get("/echo",(req,res)=>{
    res.send("Hello World!");
})

app.post("/user/groups",(req,res)=>{
    group.getGroups(req.body.username, (err, result)=>{
        if(err){
            res.json(err)
            return;
        }
        res.send(result);
    })
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
app.post('/user/randominterest', function(req, res){
    interest.getRandomCategory(req.body.username, (err, result)=>{
        if(err){
            res.send(err.message);
            return;
        }
        res.json(result);
        return;
    })
})