const express=require("express");
const router=express.Router({mergeParams : true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const {  reviewSchema } = require("../schema.js");
const { isLoggedIn , isOwner ,isReviewAuthor } =require("../middleware.js");

const Listing=require("../models/listing.js");

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
//Reviews
//POST Route
router.post("/",isLoggedIn,validateReview,wrapAsync (async( req, res)=>
    {
    
    let listing=  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     req.flash("success","New review added !");

     res.redirect(`/listings/${listing.id}`);
    })
    
    );
    //delete Review route
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>
    {
        let {id ,reviewId } =req.params;
      await Listing.findByIdAndUpdate(id, { $pull : { reviews : reviewId } });
         await Review.findByIdAndDelete(reviewId);
         req.flash("success"," review deleted !");

         res.redirect(`/listings/${id}`);
    }))
    
module.exports=router;
