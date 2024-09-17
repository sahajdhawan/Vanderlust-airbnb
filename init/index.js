const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const mongo_url="mongodb+srv://sahajd:coolsahaj@cluster0.2jqgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
main().then(()=>
{
    console.log("connected to db");
})





.catch((err)=>
{
    console.log(err);
})
async function main()
{
   await  mongoose.connect(mongo_url);
}

  

const initDB  = async ()=>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "66dcf8be5e831a8f5336f4bb",
    }));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
    

};

initDB(); 

