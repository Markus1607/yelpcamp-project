var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");




// Comments NEW
router.get("/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err)
    }else{
      res.render("comments/new", {campground: campground})
    }
  })
})


//COMMENTS CREATE
router.post("/", isLoggedIn, function(req, res){
  //lookup camoground inside id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })
});




//EDIT ROUTE

router.get("/:comments_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comments_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }
      else{
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
    })
})


//UPDATE ROUTE
router.put("/:comments_id", checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
      if(err){
        res.redirect("back");
      }
      else{
        res.redirect("/campgrounds/"+ req.params.id);
      }
    })
});



router.delete("/:comments_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comments_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
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


function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comments_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }else{
        //check if the user created the comment
        if(foundComment.author.id.equals(req.user._id)){
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
