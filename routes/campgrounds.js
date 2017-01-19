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

router.post("/", isLoggedIn,  function(req, res){

  //get data from form and add to campgrounds database
  //Redirect back to the campround page
  var name  = req.body.name,
      image = req.body.image,
      description = req.body.description,
      newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
      },
      author = {
        id: req.user._id,
        username:req.user.username
      };
Campground.create(newCampground, function(err, newlyCreated){
  if(err){
    console.log(err);
  }else{
    res.redirect("/campgrounds");
  }
});
});

router.get("/new", isLoggedIn, function(req, res){
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


//EDIT route
router.get("/:id/edit", function(req, res){
  var id = req.params.id;
  Campground.findById(id, function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.render("campgrounds/edit", {campground: foundCampground})
    }
  })

})


//UPDATE route
router.put("/:id", function(req, res){

  var id = req.params.id,
      campground = req.body.campground;

  //find and update the correct campground
  Campground.findByIdAndUpdate(id, campground, function(err, updatedCampground){

    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + id);
    }

  })

  //redirect to show page


})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");

}


module.exports = router;
