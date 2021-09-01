import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import indexRouter from './routes/index.js'
import userRouter from './routes/user.js'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import {passportConfig} from './config/passport.js'
const app = express()

// DB config
import db from './config/keys.js'

//Passport config
passportConfig(passport)

// connect to database
mongoose.connect(db,{
  useNewUrlParser : true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended : false}))

//Express Session
app.use(session({
  secret : 'key',
  resave : true,
  saveUninitialized : true
}))

// Passport middlware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash())

//Global vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Routes
app.use('/',indexRouter)
app.use('/users',userRouter)

const PORT = process.env.PORT || 8000
app.listen(8000, ()=>{
  console.log(`Server running on ${PORT}`);
})