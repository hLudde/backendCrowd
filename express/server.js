var express = require('express');
var jwt = require('jsonwebtoken')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.json());

app.use('/user/', function (req, res, next) {
    jwt.verify(req.body.token,process.env.JWT_SECRET,(err, decoded)=>{
        if(err){
            res.status(401).send();
            return;
        }
        next();
    })
})

io.on('connection', function(socket){
    console.log("A user connected! " + socket.id);
    socket.on('message', (msg)=>{
        io.emit('message',msg);
        console.log(msg);
    })
})

http.listen(process.env.HTTP_PORT,()=>{
    console.log("Crowd API Server up an running at port "+process.env.HTTP_PORT+"!");
});

module.exports.expressApp = app;