const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn , isOwner } =require("../middleware.js");
const listingController = require("../controllers/listing.js");   

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
router.route("/").get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));
//index route
router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing) )
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
    //new route
    router.get("/new",isLoggedIn,listingController.renderNewForm )
    //show route
    //edit route
    router.get("/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

    
   
module.exports=router;