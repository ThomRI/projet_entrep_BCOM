/* Main server for the REST API for Zeek retroaction */

require('dotenv').config({
    path: __dirname + '/.env'
});

const https = require('https');

const jwt = require('jsonwebtoken');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({limit: '5MB', extended: false}));
app.use(bodyParser.json());

const bcryptjs = require('bcryptjs');

// Set this to false to hide every debug messages
global.debug = true;

// Custom auth token check system
const auth = require('./auth.js');

app.post('/auth', (req, res) => {
    
    // Check password
    return bcryptjs.compare(req.body.password, process.env.PASSWORD_HASH, function(err, isMatch) {
        if(!isMatch) {
            res.status(401).send({auth: false});
            if(debug) console.log("Access denied : incorrect password");
            return;
        }

        // Generate token
        var token = jwt.sign({}, process.env.API_KEY, {
            expiresIn: 86400*10 // 10 days (86400 seconds = 24 hours)   
        });

        // Send token
        res.status(401).send({auth: true, token: token});
    });

    
});

app.get('/notify', (req, res) => {
    if(!auth.checkToken(req, res)) return;

    var alertID = (req.query.id != 'undefined') ? req.query.id : -1; // URL param : id
    var params = (req.query.params != 'undefined') ? req.query.params : {}; // URL param : params

    /* Do stuff */
});

https.createServer({
    key:    fs.readFileSync('server.key'),
    cert:   fs.readFileSync('server.crt')
}, app).listen(443, () => {
    console.log("Server started on port 443.");
});