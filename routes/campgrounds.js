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
      author = {
        id: req.user._id,
        username:req.user.username
      },
      newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
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


//EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", {campground: foundCampground});
        })
      });



//UPDATE ROUTE
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
})


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  })
})


//MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");

}

function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect("back");
      }else{
        //check if the user created the campground
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect("back");
        }
      }
    })
  }else{
    res.redirect("back");
  }
}



module.exports = router;
