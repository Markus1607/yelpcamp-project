var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    Campground = require("./models/campground"),
    mongoose     = require("mongoose"),
    seedDB    = require("./seeds");



mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();



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
        res.render("index", {campdata: allCampgrounds})
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
    res.render("new");
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
      res.render("show", {campground: foundCampground});
    }
  });
})


app.listen(3000, function(){
  console.log("listening ........");
})
