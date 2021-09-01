export const ensureAuthenticated = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next()
  }
  req.flash({'error_msg' : 'Please Login to view Resources'})
  res.redirect('/users/login')
}