if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo_url="mongodb+srv://sahajd:coolsahaj@cluster0.2jqgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Listing=require("./models/listing.js");
const listingRouter=require("./routes/listing.js");
const userRouter=require("./routes/user.js");
const path=require("path");
const methodOverride=require("method-override");
const reviewRouter=require("./routes/reviews.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const store=MongoStore.create({
    mongoUrl: mongo_url,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*60*60, //24 hours
    
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})
const sessionOptions={
    store:store,
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized :true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    },

}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
// app.get("/",(req,res)=>
// {
//     res.send("Hi i am root");

// });

app.use((req,res,next) =>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
res.locals.currUser=req.user;
    next();
})
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

app.get("/demouser",async (req,res)=>
{
    let fakeUser= new User({
        email:"student45@gmail.com",
        username:"delta-student23"

    });
  let registeredUser= await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>
{let { statusCode=500 , message="Something went wrong!" } = err;
// res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{message});

})
app.listen(3000,()=>
{
   console.log("server is listening to port 8080"); 
});
