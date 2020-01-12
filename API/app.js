'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db/models/index");
const router = require("./routes/index")(app, express.Router());


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());



app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening on " + (process.env.PORT || 8000));
});
