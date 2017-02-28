var Campground = require("../models/campground"),
    Comment    = require("../models/comment");



var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("back");
      }else{
        //check if the user created the campground
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          res.flash("error", "You dont have persmission to do that!")
          res.redirect("back");
        }
      }
    })
  }else{
    req.flash("error", "You need to be logged in to do that!")
    res.redirect("back");
  }
};



middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
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
  };


middlewareObj.isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      req.flash("error", "Please Login First!");
      res.redirect("/login");
    };





module.exports = middlewareObj
