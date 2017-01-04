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



mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();



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




//SCHEMA SETUP


//MODEL SCHEMA



//INSERT NEW DATA WITH DESCRIPTION FIELD
/*Campground.create({
  name:"Granite Hill",
  image:"https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
  description:"this is a huge granite hill no bathroom, no water, beautiful granite"
}, function(err, campground){
  if(err){
    console.log(err);
  }else{
    console.log("Newly Created Campground");
    console.log(campground);
  }
})*/


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  //GET all campgrouds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }else{
        res.render("campgrounds/index", {campdata: allCampgrounds})
    }
  });

});

app.post("/campgrounds", function(req, res){

  //get data from form and add to campgrounds database
  //Redirect back to the campround page
  var name  = req.body.name,
      image = req.body.image,
      newCampground = {
        name: name,
        image: image
      };
Campground.create(newCampground, function(err, newlyCreated){
  if(err){
    console.log(err);
  }else{
    res.redirect("/campgrounds");
  }
});
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});



//Show PAGE
app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided id
  //render show template with that campground
  var id = req.params.id;

  Campground.findById(id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    }else{
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
})



//========================//
//Comments Routes
//=========================//

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err)
    }else{
      res.render("comments/new", {campground: campground})
    }
  })

})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  //lookup camoground inside id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("./campgrounds");
    }else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })
})

//===============================
//AUTH ROUTES
//======================

//shoe register form
app.get("/register", function(req, res){
  res.render("register");
})

//handle sign up logic

app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    })

  })
})




//==========================
//SHOW LOGIN form
//===================================
app.get("/login", function(req,res){
  res.render("login");
})
//handling login logic
app.post("/login", passport.authenticate("local",
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"
     }), function(req, res){

});




//===========================================
//LOGOUT ROUTE
//========================================

app.get("/logout", function(req, res){
  res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");

}




app.listen(3000, function(){
  console.log("listening ........");
})
