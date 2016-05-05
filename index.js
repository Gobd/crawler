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
const port = process.env.NODE_ENV == `production` ? 80 : 3000;
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore(
    {
        uri: 'mongodb://127.0.0.1:27017/trails',
        collection: 'mySessions'
    });

// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

//setup session, listening and parsing
app.use(session({
    secret: config.sessionSecret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave:false,
    saveUninitialized:false,
    store: store
}));
app.use(express.static(__dirname + `/dist`));
app.use(bodyParser.json({limit: `50mb`}));
app.use(cors());
app.listen(port);

//open connection to mongo
mongoose.set(`debug`, process.env.NODE_ENV != `production`);
mongoose.connect(`mongodb://127.0.0.1:27017/trails`);
mongoose.connection.once(`open`, function () {
    console.log(`connected to mongodb`);
    console.log(`listening on port `+ port);
    console.log(process.env.NODE_ENV);

});

// app.post(`/trails`, mainCtrl.postTrails);
app.post(`/`, mainCtrl.getTrail);
