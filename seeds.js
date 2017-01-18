var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

var data = [
  {
    name: "Cloud's rest",
    image:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg",
    description: "blah blah blah blah blah"
  },
  {
    name: "Lola's lounge",
    image:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg",
    description: "blah blah blah blah blah"
  },
  {
    name: "Apple hills",
    image:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg",
    description: "blah blah blah blah blah"
  }

];





function seedDB(){
  Campground.remove({}, function(err){
    if(err){
      console.log(err)
    }
    console.log("All campgrounds removed");
      data.forEach(function(seed){
        Campground.create(seed, function(err, data){
          if(err){
            console.log(err)
          }else{
            console.log("Added all Campgrounds");
            Comment.create({
              text:"this place is great but i wish it had internet",
              author:"Hommer"
            }, function(err, comment){
              if(err){
                console.log(err)
              }else{
                data.comments.push(comment);
                data.save();
                console.log("created new comment");
              }
            })
          }
        })
     });

    })

}


module.exports = seedDB;
