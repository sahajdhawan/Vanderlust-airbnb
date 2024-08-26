const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
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
const validateListing = (req,res,next) => {
    
        let { error } =  listingSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,error);
        }
        else
        {
            next();
        }
};
const validateReview = (req,res,next) => {
    
    let { error } =  reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
};
app.get("/listings",wrapAsync(async (req,res)=>
{ 
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{ allListings }); 
}));
//new route
app.get("/listings/new", (req,res)=>
{
    res.render("listings/new.ejs");
})
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>
{let { id }=req.params;
    const allListings= await Listing.findById(id).populate("reviews");
    
  res.render("listings/show.ejs",{ allListings });
}));
//create rouet
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>
{if(!req.body.listing)
    {
        throw new ExpressError(400,"send valid data for listing"); 
    }
console.log(result);
        const newListing=new Listing(req.body.listing);
     
        await newListing.save();
     
        res.redirect("/listings");
    
  
  
}));
//edit route
app.get("/listings/:id/edit",wrapAsync( async (req,res)=>
{
    let { id }=req.params;
    const listing= await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs",{ listing });


}));
//updateroute
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>
{
    
    let { id } =req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect("/listings");
})
);

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>
{
    let {id} =req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//Reviews
//POST Route
app.post("/listings/:id/reviews",validateReview,wrapAsync (async( req, res)=>
{

let listing=  await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();

 res.redirect(`/listings/${listing.id}`);
})

);
//delete Review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>
{
    let {id ,reviewId } =req.params;
  await Listing.findByIdAndUpdate(id, { $pull : { reviews : reviewId } });
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
}))
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
