var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose");



mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});


//MODEL SCHEMA
var Campground = mongoose.model("Campground", campgroundSchema);


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  //GET all campgrouds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }else{
        res.render("campgrounds", {campdata: allCampgrounds})
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

app.get("/campgrounds/:id", function(req, res){
  res.send("THIS WILL BE THE SHOW PAGE");
})


app.listen(3000, function(){
  console.log("listening ........");
})
