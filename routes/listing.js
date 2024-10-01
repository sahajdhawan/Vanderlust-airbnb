const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn , isOwner } =require("../middleware.js");
const listingController = require("../controllers/listing.js");   
const multer  = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });
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
    .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
  
//index route
router.get("/new",isLoggedIn,listingController.renderNewForm )
router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing) )
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
    //new route

    //show route
    //edit route
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

    
   
module.exports=router;