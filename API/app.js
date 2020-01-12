'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
const db = require("./db/models/index");
const dbHelpers = require("./db/helpers/index")(db);
const redisClient = redis.createClient();

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

const router = require("./routes/index")(app, express.Router());

app.use(app.oauth.errorHandler());




redisClient.on('connect', () => {
  console.log('Redis connection succesful!');
});

redisClient.on('error', (err) => {
  console.log('Redis error: ' + err);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening on " + (process.env.PORT || 8000));
});
