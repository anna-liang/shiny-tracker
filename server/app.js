const express = require('express');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(bodyParser.json());
const crypto = require('crypto');

const cookie = require('cookie');

// const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.static('public'));

const util = require('util');
const TextEncoder = new util.TextEncoder();

const mongoose = require('mongoose');

const uri = process.env.SHINY_TRACKER_MONGO_URI;

mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) =>
    console.log('MongoDB database connection established successfully')
  )
  .catch((err) => console.log(err));

const conn = mongoose.connection;

const cors = require('cors');
app.use(cors({
  origin:'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

const session = require('express-session');
app.use(session({
    secret: 'pokemon',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: true
    // }
}));

var Hunt = (function() {
    let time = Date.now();
    let date = new Date(time);
    return function item(target, targetImg, count, gen, method, phase, charm, active, username) {
        this.id = uuidv4();
        this.target = target;
        this.targetImg = targetImg;
        this.count = count;
        this.gen = gen;
        this.method = method;
        this.phase = phase;
        this.charm = charm;
        this.active = active;
        this.date = date;
        this.user = username;
    };
}());

app.use(function (req, res, next){
    req.username = ('username' in req.session) ? req.session.username : '';
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

var isAuthenticated = function(req, res, next) {
    console.log(req.username);
    if (!req.username) return res.status(401).end("Access denied");
    next();
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/signup/', function (req, res, next) {
    // console.log("signed up");
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var saltedHash = hash.digest('base64');
    conn.collection('users').findOne({_id: username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("Username " + username + " already exists");
        conn.collection('users').insertOne({_id: username, hash: saltedHash, salt: salt}, function(err) {
            if (err) return res.status(500).end(err);
            req.session.username = username;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            }));
            return res.json("User " + username + " signed up");
        });
    })
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/signin/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // console.log("signed in", username, password);
    conn.collection('users').findOne({_id: username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("Access denied");
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        if (user.hash !== hash.digest('base64')) return res.status(401).end("Access denied");
        req.session.username = username;
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        }));
        console.log("signed in");
        return res.json("User " + username + " signed in");
    });
});

// New Hunt
app.post('/api/hunt/', function (req, res, next) {
    // !!! needs to be a list of hunts (pokemon name acts as id)
    var hunt = new Hunt(
        req.body.target,
        req.body.targetImg,
        req.body.count,
        req.body.gen,
        req.body.method,
        req.body.phase,
        req.body.charm,
        req.body.active,
        req.username
    );
    console.log("NEW HUNT:", hunt);
    conn.collection('hunts').insertOne({_id: hunt.id, target: hunt.target, targetImg: hunt.targetImg,
        count: hunt.count, gen: hunt.gen, method: hunt.method, phase: hunt.phase, charm: hunt.charm, active: hunt.active,
        date: hunt.date, user: hunt.user}, function(err) {
        if (err) return res.status(500).end(err);
        return res.json(hunt);
    });
});

// Get all hunts of a user
app.get('/api/hunt/', function(req, res, next) {
    // conn.collection('user').findOne({_id: req.username}, function(err, user) {
    //     if (err) return res.status(500).end(err);
    //     if (!user) return res.status(404).end("User " + req.username + " does not exist");
        // conn.collection('hunts').find({user: req.username}, function(err, hunts) {
        conn.collection('hunts').find({}).toArray(function(err, hunts) {
            if (err) return res.status(500).end(err);
            // if (!hunts) return res.status(404).end("Hunts do not exist for user " + req.username);
            if (!hunts) return res.status(404).end("No hunts found");
            console.log(hunts);
            return res.json(hunts);
        });
    });
// });

// Get hunt by id
// app.get('/api/hunt/:id/', function(req, res, next) {
//     conn.collection('hunts').findOne({_id: req.params.id}, function(err, hunt) {
//         if (err) return res.status(500).end(err);
//         if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
//         return res.json(hunt);
//     });
// });

// Get a user's active hunt
app.get('/api/activeHunt/', function(req, res, next) {
    conn.collection('user').findOne({_id: req.username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end("User " + req.username + " does not exist");
        conn.collection('hunts').findOne({active: true, user: req.username}, function(err, hunt) {
            if (err) return res.status(500).end(err);
            if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
            return res.json(hunt);
        });
    });
});

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
app.get('/signout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
    });
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7
    }));
    // res.redirect('/');
    console.log("signed out");
    return res.json("User signed out");
});

// Update Hunt
app.patch('/api/hunt/:id', function (req, res, next) {
    console.log("PATCH HUNT:", req.params.id, req.body.target);
    conn.collection('hunts').findOne({_id: req.params.id}, function(err, hunt) {
        if (err) return res.status(500).end(err);
        if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
        conn.collection('hunts').updateOne({_id: req.params.id}, {$set: {"target": req.body.target, "targetImg": req.body.targetImg,
            "count": req.body.count, "gen": req.body.gen, "method": req.body.method, "phase": req.body.phase, "charm": req.body.charm, "active": req.body.active}}, function(err, result) {
                if (err) return res.status(500).end(err);
                console.log("Matched", result.matchedCount, "Modified", result.modifiedCount);
                return result.modifiedCount == 1 ? res.json("Hunt updated successfully") : res.status("Hunt not updated");
            });
    });
});

// Delete Hunt
app.delete('/api/hunt/:id', function (req, res, next) {
    console.log(req.params.id);
    conn.collection('hunts').findOne({_id: req.params.id}, function(err, hunt) {
        if (err) return res.status(500).end(err);
        // if (hunt.user !== req.username) return res.status(403).end("forbidden");
        if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
        console.log(hunt);
        conn.collection('hunts').deleteOne({_id: req.params.id}, function(err, result) {
            if (err) return res.status(500).end(err);
            console.log("Deleted", result.deletedCount);
            return result.deletedCount == 1 ? res.json("Hunt deleted successfully") : res.status("Hunt not deleted");
        });
    });
});


const http = require('http');
const { cloneElement } = require('react');
const PORT = 3001;
http.createServer(app).listen(PORT, function(err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});