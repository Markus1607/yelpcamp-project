var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser");




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creeek", image: "http://campinghatley.com/wp-content/uploads/2013/12/camping-.jpg"},
  {name: "Granite Hill", image: "http://haileyidaho.com/wp-content/uploads/2015/01/Stanley-lake-camping-Credit-Carol-Waller-2011.jpg"},
  {name: "West Coast", image:"http://www.wildnatureimages.com/images%203/060731-372..jpg"}
];


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){

  res.render("campgrounds", {campdata: campgrounds});
});

app.post("/campgrounds", function(req, res){

  //get data from form and add to campgrounds array
  //Redirect back to the campround page
  var name  = req.body.name,
      image = req.body.image,
      newCampground = {
        name: name,
        image: image
      };
  campgrounds.push(newCampground);


  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});


app.listen(3000, function(){
  console.log("listening ........");
})
