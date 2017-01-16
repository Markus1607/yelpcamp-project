var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");




router.get("/", function(req, res){
  //GET all campgrouds from Database
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }else{
        res.render("./campgrounds/index", {campdata: allCampgrounds});
    }
  });

});

router.post("/", function(req, res){

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

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});



//Show PAGE
router.get("/:id", function(req, res){
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


module.exports = router;
