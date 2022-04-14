'use strict'
import mongoose from 'mongoose'
import {giftSchema} from './Gift.js'

const schema = new mongoose.Schema({
  name: {type: String, maxlength: 254, required: true},
  birthDate: {type: Date, required: true},
  owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},//TODO: THINK about the default user
  sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  gifts: [giftSchema], 
  imageUrl:{type:String,maxlength:1024}  
},
{
  //automatically includes createdAt and updatedAt properties
  timestamps:true,
}
)
const Model = mongoose.model('Person', schema)

export default Model