var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStratergy = require("passport-local");
var PassportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

//------SETUP--------------------
mongoose.connect("mongodb://localhost/auth_demo_app");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Pikachu does pika pika which makes no sense!",
    //next two lines just copy-paste. it's mandatory.
    resave: false,
    saveUninitialized: false
}));

//SETUP Passport
app.use(passport.initialize());
app.use(passport.session());


//tell passport which stratergy to use in authentication
passport.use(new LocalStratergy(User.authenticate()));
//responsible to reading the session, taking the data that's encoded and unencoding it, then encoding it back, etc
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//--------------------------------



//ROUTES-----------------------------------------------------
app.get("/", function(req, res){
   res.render("home"); 
});
app.get("/secret", isLoggedIn, function(req, res){
    //when it get's a get req to /secret, it's gonna run isLoggedIn before anything else
    res.render("secret"); 
});


//Auth Routes
//show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
    // req.body.username
    // req.body.password
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
});


// Login Routes
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middlware -> runs when it receives info in post route. We can add as many middleware as we want
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    //empty for now
});


// LogOut Routes
app.get("/logout", function(req, res){
    //destroy user's session data from req to req
   req.logout();
   res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next){
    //next: the next thing that needs to be called: usually, the callback function specified after it
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}


//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!"); 
});