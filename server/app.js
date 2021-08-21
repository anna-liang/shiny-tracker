const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const cookie = require('cookie');

const session = require('express-session');

app.use(express.static('public'));

const cors = require('cors');
app.use(cors({
  origin:'http://localhost:3000',
//   withCredentials: true,
  optionsSuccessStatus: 200,
}));

app.use(session({
    secret: 'pokemon',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true
    }
}));

var Hunt = (function() {
    let time = Date.now();
    let date = new Date(time);
    return function item(target, count, gen, method, phase, charm, active) {
        this.target = target;
        this.count = count;
        this.gen = gen;
        this.method = method;
        this.phase = phase;
        this.charm = charm;
        this.active = active;
        this.date = date;
    };
}());

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    var isSessionSet = req.session.isSessionSet;
    res.setHeader('Set-Cookie', cookie.serialize('init', isSessionSet, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
        secure: true,
        sameSite: true
    }));
    next();
});

// New Hunt
app.post('/api/hunt/', function (req, res, next) {
    // let hunt = new Hunt(req.target, req.count, req.gen, req.method, req.phase, req.charm, req.active);
    // !!! needs to be a list of hunts (pokemon name acts as id)
    console.log("NEW HUNT");
    req.session.isSessionSet = true;
    res.setHeader('Set-Cookie', cookie.serialize('target', req.body.target, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    }));
    res.setHeader('Set-Cookie', cookie.serialize('count', req.body.count, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    }));
    // res.setHeader('target', req.target);
    // res.setHeader('count', req.count);
    // res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("cookies set");
    // console.log(cookie);
    console.log(res.headers);
    return res.json("new hunt");
});

// Update Hunt???? (can you update a hunt that's not a target?)
app.patch('/api/hunt/', function (req, res, next) {

});

// Update Target
app.patch('/api/target/', function (req, res, next) {

});

// Delete Hunt (can be more than one)
app.delete('/api/hunt/', function (req, res, next) {

});


const http = require('http');
const PORT = 3001;
http.createServer(app).listen(PORT, function(err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});