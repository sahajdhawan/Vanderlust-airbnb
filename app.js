const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const listings=require("./routes/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const reviews=require("./routes/reviews.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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

});
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


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>
{let { statusCode=500 , message="Something went wrong!" } = err;
// res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{message});

})
app.listen(8080,()=>
{
   console.log("server is listening to port 8080"); 
});
