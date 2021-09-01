import { Router } from "express"
import {User} from '../models/user.js'
import bcrpty from 'bcrypt'
import passport from "passport"
const router = Router()

//Login Page
router.get('/login',(req,res) => res.render('login'))
//Register Page
router.get('/register',(req,res) => res.render('register'))

// Register Handle
router.post('/register',async (req,res)=>{
  const {name , email, password, password2} = req.body

  let errors = [];
  // Check Required
  if(!name || !email || !password || !password2){
    errors.push({msg : 'Please fill in all field'})
  }
  
  // Check Password match
  if(password !== password2){
    errors.push({msg : 'Passwords do not match'})
  }

  // Check Password length
  if(password.length<6){
    errors.push({msg : 'Passwords should be atleast 6 characters'})
  }

  if(errors.length > 0){
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    })
  }else{
    // Validation Passed
    User.findOne({email : email})
      .then(user =>{
        if(user){
          // User Exist
          errors.push({msg : 'Email is already registered'})
          res.render('register',{
            errors,
            name,
            email,
            password,
            password2
          })
        }
        else{
          const newUser = new User({
            name,
            email,
            password
          })
          bcrpty.genSalt(15,(err,salt)=>{
            bcrpty.hash(newUser.password,salt,(err,hash)=>{
              if(err) throw err
              newUser.password = hash
              newUser.save()
                .then(user=>{
                  console.log(user)
                  req.flash('success_msg','You are now Registered and can login')
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err))
            })
          })
        }
      })

  }
})

// Login Handle

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect : '/users/login',
    failureFlash : true
  })(req,res,next)
})

router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/users/login')
})
export default router