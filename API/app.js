'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const cookieParser = require("cookie-parser")
const csurf = require("csurf")
const csrfProtection = csurf({ cookie: true })
const app = express();
const db = require("./db/models/index");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const redisClient = redis.createClient();
const dbHelpers = require("./db/helpers/index")(db, redisClient, nodemailer, crypto);


const oAuth2Server = require('node-oauth2-server');
const oAuthModel = require('./authentication/accessTokenModel')(dbHelpers.userHelper, redisClient);

app.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: false
});

app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(bodyParser.json());
const router = require("./routes/index")(app, express.Router(), dbHelpers);
app.use(app.oauth.errorHandler());
app.use('/uploads', express.static('uploads'));


redisClient.on('connect', () => {
  console.log('Redis connection succesful!');
});

redisClient.on('error', (err) => {
  console.log('Redis error: ' + err);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening on " + (process.env.PORT || 8000));
});
