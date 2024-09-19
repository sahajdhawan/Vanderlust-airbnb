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
//index route
router.get("/",wrapAsync(listingController.index));
    //new route
    router.get("/new",isLoggedIn,listingController.renderNewForm )
    //show route
    router.get("/:id",wrapAsync(listingController.showListing));
    //create rouet
    router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
    //edit route
    router.get("/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
    //updateroute
    router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing) );
    
    //delete route
    router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
module.exports=router;