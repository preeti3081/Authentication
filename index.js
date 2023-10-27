const express = require('express');
const port = 8000;
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/mongoose');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy')
const expressLayouts = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//reading through post request
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('./assets'));

// Use express-ejs-layouts as middleware
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(session({
    name:'codeial',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create({
        //mongooseConnection:db,
        client:mongoose.connection.getClient(db),
        autoRemove: 'disabled',
        collection: 'sessions',
    },
    function(err){
        console.log(err ||'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// Define your routes
app.use('/', require('./routes/index'));


app.listen(port, function (err) {
    if (err) {
        console.log('Error in running server', err);
    }
    console.log('Yup! My express server is running on port:', port);
});