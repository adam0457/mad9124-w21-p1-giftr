'use strict'

//const giftSchema = require('./Gift')
const User = require('./User')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String, maxlength: 254, required: true},
  birthDate: {type: Date, required: true},
  owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},//TODO: THINK about the default user
  sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  //gifts: [giftSchema], 
  imageUrl:{type:String,maxlength:1024}  
},
{
  //automatically includes createdAt and updatedAt properties
  timestamps:true,
}
)
const Model = mongoose.model('Person', schema)

module.exports = Model