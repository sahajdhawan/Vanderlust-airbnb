const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
main().then(()=>
{
    console.log("connected to db");
})
.catch((err)=>
{
    console.log(err);
})
//connecting to database
async function main()
{
   await  mongoose.connect(mongo_url);
}
app.get("/",(req,res)=>
{
    res.send("Hi i am root");

})

// app.get("/testListing",async(req,res)=>
// {
// let sampleListing= new Listing({
//     title : "My new villa",
//     description: "by the beach",
//     price : 1200,
//     location: "Calangute",
//     country: "India",
// });
//index route

app.get("/listings",async (req,res)=>
{ 
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{ allListings }); 
});
//new route
app.get("/listings/new", (req,res)=>
{
    res.render("listings/new.ejs");
})
//show route
app.get("/listings/:id",async (req,res)=>
{let { id }=req.params;
    const allListings= await Listing.findById(id);
  res.render("listings/show.ejs",{ allListings });
})
//create rouet
app.post("/listings",async (req,res)=>
{
   const newListing=new Listing(req.body.listing);
   await newListing.save();
   console.log(newListing);
   res.redirect("/listings");
})
//edit route
app.get("/listings/:id/edit", async (req,res)=>
{
    let { id }=req.params;
    const listing= await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs",{ listing });


})
//updateroute
app.put("/listings/:id", async (req,res)=>
{
    let { id } =req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect("/listings");
})

//delete route
app.delete("/listings/:id",async (req,res)=>
{
    let {id} =req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
app.listen(8080,()=>
{
   console.log("server is listening to port 3000"); 
});
