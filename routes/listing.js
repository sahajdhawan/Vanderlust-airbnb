const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn } =require("../middleware.js");
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
router.get("/",wrapAsync(async (req,res)=>
    { 
      const allListings= await Listing.find({});
      res.render("listings/index.ejs",{ allListings }); 
    }));
    //new route
    router.get("/new",isLoggedIn, (req,res)=>
    {
       
        res.render("listings/new.ejs");
    })
    //show route
    router.get("/:id",wrapAsync(async (req,res)=>
    {let { id }=req.params;
        const allListings= await Listing.findById(id).populate("reviews");
        if(!allListings)
        {
            req.flash("error","listing you requested for does not exist !");
            res.redirect("/listings");
        }
      res.render("listings/show.ejs",{ allListings });
    }));
    //create rouet
    router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>
    {if(!req.body.listing)
        {
            throw new ExpressError(400,"send valid data for listing"); 
        }
  
            const newListing=new Listing(req.body.listing);
         
            await newListing.save();

         req.flash("success","New listing created !");
            res.redirect("/listings");
            
        
      
      
    }));
    //edit route
    router.get("/edit",isLoggedIn,wrapAsync( async (req,res)=>
    {
        let { id }=req.params;
        const listing= await Listing.findById(id);
        console.log(listing);
        if(!allListings)
        {
            req.flash("error","listing you requested for does not exist !");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs",{ listing });
    
    
    }));
    //updateroute
    router.put("/:id",isLoggedIn,validateListing, wrapAsync(async (req,res)=>
    {
        
        let { id } =req.params;
         await Listing.findByIdAndUpdate(id,{...req.body.listing});
         res.redirect("/listings");
    })
    );
    
    //delete route
    router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>
    {
        let {id} =req.params;
       let deletedListing=await Listing.findByIdAndDelete(id);
       req.flash("success","listing deleted !");

        res.redirect("/listings");
    }));
module.exports=router;