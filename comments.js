// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install nodemon
// npm install ejs
// npm install express-sanitizer
// npm install method-override
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose
// npm install express-session

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var methodOverride = require("method-override");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/comments_app");

// Set up ejs
app.set("view engine", "ejs");

// Set up body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up express-sanitizer
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());

// Set up method-override
app.use(methodOverride("_method"));

// Set up express-session
app.use(expressSession({
    secret: "Rusty is the best and the cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

// Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Create a new comment
app.post("/comments", isLoggedIn, function(req, res) {
    Comment.create({