import { Strategy } from 'passport-local'
import bcrpty from 'bcrypt'

// Load Model
import {User} from '../models/user.js'

function  passportConfig(passport){
  passport.use(
    new Strategy({usernameField : 'email'},async (email,password,done)=>{
      try{
        const user = await User.findOne({email : email})
        if(!user){
          return done(null,false,{message : 'That email is not Registered'})
        }
        // Match Password
        bcrpty.compare(password,user.password,(err,isMatch)=>{
          if(err){
            throw err;
          }
          if(isMatch){
            done(null,user )
          }else{
            done(null,false,{message : 'Enter correct password'})
          }
        })
      }catch(err){
        console.log(err);
      }
    })
  )
   passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
 }
export  {passportConfig}