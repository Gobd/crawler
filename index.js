`use strict`;

//setup external packages
const express = require(`express`);
const bodyParser = require(`body-parser`);
const session = require(`express-session`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);


//setup internal packages
const config = require(`./config`);
const mainCtrl = require(`./Controllers/mainCtrl`);

//create app and specify port
const app = express();
const port = process.env.NODE_ENV === `production` ? 80 : 3000;

//setup session, listening and parsing
app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false
}));
app.use(express.static(__dirname + `/dist`));
app.use(bodyParser.json({limit: `50mb`}));
app.use(cors());
app.listen(port);


//open connection to mongo
mongoose.set(`debug`, process.env.NODE_ENV === `production`);
mongoose.connect(`mongodb://127.0.0.1:27017/trails`);
mongoose.connection.once(`open`, function () {
    console.log(`connected to mongodb`)
});

// app.post(`/trails`, mainCtrl.postTrails);
app.post(`/`, mainCtrl.getTrail);
