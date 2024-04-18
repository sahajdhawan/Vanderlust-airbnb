const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
     type:String,
     required:true,
    },
    description:String,

    image:{
        __filename:
        {
            type:String,
        },
        _url:
        {
            type:String,
        }
      
        // default:"https://unsplash.com/photos/a-long-white-hallway-with-shelves-and-stairs-2aZlAV53kww",
        // set: (v)=> v === ""? "https://unsplash.com/photos/a-long-white-hallway-with-shelves-and-stairs-2aZlAV53kww" : v
        },
    price:Number,
    location:String,
    country:String,
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;