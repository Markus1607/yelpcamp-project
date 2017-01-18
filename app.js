var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    Campground = require("./models/campground"),
    mongoose     = require("mongoose"),
    passport     = require("passport"),
    Comment     = require("./models/comment"),
    LocalStrategy = require("passport-local"),
    User         = require("./models/user"),
    seedDB    = require("./seeds");


//Requiring routes
var commentsRoute = require("./routes/comments"),
    campgroundRoute = require("./routes/campgrounds"),
    authRoute = require("./routes/auth");



mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//seedDB();



//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"Mark's secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})

app.use(authRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments",commentsRoute);


app.listen(3000, function(){
  console.log("listening ........");
})
