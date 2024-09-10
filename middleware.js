module.exports.isLoggedIn=(req,res,next)=>
{
  req.session.redirectUrl=req.originalUrl;
    if (!req.isAuthenticated())
    {
        req.flash("error","you must be logged into create listing !");
       return  res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}