'use strict';
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride=require('method-override');
const exphbs  = require('express-handlebars');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const path=require('path');
const passport=require('passport');



var MongoClient=require('mongodb').MongoClient;
const app = express();
//DB config

const db=require('./config/database');


//Static folder
app.use(express.static(path.join(__dirname,'public')))
//Load routes

const ideas=require('./routes/ideas')
const users=require('./routes/users')


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {useNewUrlParser: true}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//passport config
require('./config/passport')(passport);


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user=req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port =process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});