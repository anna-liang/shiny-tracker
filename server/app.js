const express = require('express');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
const crypto = require('crypto');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.static('public'));

const mongoose = require('mongoose');

const uri = process.env.SHINY_TRACKER_MONGO_URI;

mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>
    console.log('MongoDB database connection established successfully')
  )
  .catch((err) => console.log(err));

const conn = mongoose.connection;

const cors = require('cors');
/* Dev */
// app.use(cors({
//     origin:'http://localhost:3000',
//     credentials: true,
//     optionsSuccessStatus: 200,
// }));
/* Prod */
app.use(cors({
    origin: 'https://shinytracker.herokuapp.com',
    credentials: true,
    optionsSuccessStatus: 200,
}));

const session = require('express-session');
/* Dev */
// app.use(session({
//     secret: 'pokemon',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 99999999,
//         httpOnly: true,
//         secure: false,
//     }
// }));
/* Prod */
app.use(session({
    secret: 'pokemon',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 99999999,
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }
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
    if (!req.username) return res.status(401).end("Access denied");
    next();
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/signup/', function (req, res, next) {
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
            return res.json({"username": username});
        });
    })
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/signin/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    conn.collection('users').findOne({_id: username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("Access denied");
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        if (user.hash !== hash.digest('base64')) return res.status(401).end("Access denied");
        req.session.username = username;
        return res.json({"username": username});
    });
});

// New Hunt
app.post('/api/hunt/', isAuthenticated, function (req, res, next) {
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
    conn.collection('hunts').insertOne({_id: hunt.id, target: hunt.target, targetImg: hunt.targetImg,
        count: hunt.count, gen: hunt.gen, method: hunt.method, phase: hunt.phase, charm: hunt.charm, active: hunt.active,
        date: hunt.date, user: hunt.user}, function(err) {
        if (err) return res.status(500).end(err);
        return res.json(hunt);
    });
});

// Get all hunts of a user
app.get('/api/hunt/', isAuthenticated, function(req, res, next) {
    conn.collection('users').findOne({_id: req.username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end("User " + req.username + " does not exist");
        conn.collection('hunts').find({user: req.username}).toArray(function(err, hunts) {
            if (err) return res.status(500).end(err);
            if (!hunts) return res.status(404).end("Hunts do not exist for user " + req.username);
            return res.json(hunts);
        });
    });
});

// Get a user's active hunt
app.get('/api/activeHunt/', isAuthenticated, function(req, res, next) {
    conn.collection('users').findOne({_id: req.username}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(404).end("User " + req.username + " does not exist");
        conn.collection('hunts').findOne({active: true, user: req.username}, function(err, hunt) {
            if (err) return res.status(500).end(err);
            if (!hunt) return res.json(null);
            return res.json(hunt);
        });
    });
});

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
app.get('/signout/', isAuthenticated, function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
    });
    return res.json({"username": ""});
});

// Update Hunt
app.patch('/api/hunt/:id', isAuthenticated, function (req, res, next) {
    conn.collection('hunts').findOne({_id: req.params.id}, function(err, hunt) {
        if (err) return res.status(500).end(err);
        if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
        conn.collection('hunts').updateOne({_id: req.params.id}, {$set: {"target": req.body.target, "targetImg": req.body.targetImg,
            "count": req.body.count, "gen": req.body.gen, "method": req.body.method, "phase": req.body.phase, "charm": req.body.charm, "active": req.body.active}}, function(err, result) {
                if (err) return res.status(500).end(err);
                return result.modifiedCount == 1 ? res.json("Hunt updated successfully") : res.status("Hunt not updated");
            });
    });
});

// Delete Hunt
app.delete('/api/hunt/:id', isAuthenticated, function (req, res, next) {
    conn.collection('hunts').findOne({_id: req.params.id}, function(err, hunt) {
        if (err) return res.status(500).end(err);
        if (hunt.user !== req.username) return res.status(403).end("forbidden");
        if (!hunt) return res.status(404).end("Hunt #" + req.params.id + " does not exist");
        conn.collection('hunts').deleteOne({_id: req.params.id}, function(err, result) {
            if (err) return res.status(500).end(err);
            return result.deletedCount == 1 ? res.json("Hunt deleted successfully") : res.status("Hunt not deleted");
        });
    });
});


const http = require('http');
const PORT = process.env.PORT || 3001;
http.createServer(app).listen(PORT, function(err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});