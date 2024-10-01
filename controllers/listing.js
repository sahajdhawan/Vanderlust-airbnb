const Listing=require("../models/listing");
module.exports.index = async (req,res)=>
{ 
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{ allListings }); 
};
module.exports.renderNewForm = (req,res)=>
{
   
    res.render("listings/new.ejs");
};
module.exports.showListing=async (req,res)=>
{let { id }=req.params;
    const allListings= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!allListings)
    {
        req.flash("error","listing you requested for does not exist !");
        res.redirect("/listings");
    }

  res.render("listings/show.ejs",{ allListings });
}

module.exports.createListing=async (req,res,next)=>
{if(!req.body.listing)
    {
        throw new ExpressError(400,"send valid data for listing"); 
    }
  let url= req.file.path;
  let filename= req.file.filename;
console.log(url,"..",filename);
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
     newListing.image= {url,filename};
        await newListing.save();

     req.flash("success","New listing created !");
        res.redirect("/listings");
    }
 module.exports.renderEditForm= async (req,res)=>
 {
     let { id }=req.params;
     const listing= await Listing.findById(id);
     console.log(listing);
     if(!listing)
     {
         req.flash("error","listing you requested for does not exist !");
         res.redirect("/listings");
     }
     let originalImageUrl=listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_300")
     res.render("listings/edit.ejs",{ listing ,originalImageUrl });
 
 
 }
 module.exports.updateListing=async (req,res)=>
 {
     
     let { id } =req.params;

    let listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined")

    {
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image= {url,filename};
    await listing.save();
    }
      req.flash("success","Successfully updated listing !");
      res.redirect(`/listings/${id}`);
 }

 module.exports.deleteListing=async (req,res)=>
 {
     let {id} =req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted !");

     res.redirect("/listings");
 }