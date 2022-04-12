'use strict'

const mongoose = require('mongoose')

const giftSchema = new mongoose.Schema({
  name: {type: String, maxlength: 64, minlength:4, required: true},
  price: {type: Number, min: 100, default: 1000, set: value => parseInt(value)},
  imageUrl: {type: String, maxlength: 1024},
  store:{
      name:{type:String, maxlength:254},
      productUrl:{type:String, maxlength:1024}
  }
},{
   //automatically includes createdAt and updatedAt properties
   timestamps:true,
})
const Gift = mongoose.model('Gift', giftSchema)

module.exports = Gift