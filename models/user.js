import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  date : {
    type : Date,
    default : Date.now()
  }
})
UserSchema.index({
  email : 1
},{unique : true})

export const User = mongoose.model('user', UserSchema)
