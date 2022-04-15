'use strict'

// const mongoose = require('mongoose')
import mongoose from "mongoose"

export const giftSchema = new mongoose.Schema({
  name: {type: String, maxlength: 64, minlength:4, required: true},
  price: {type: Number, min: 100, default: 1000},
  imageUrl: {type: String, maxlength: 1024},
  store:{
      name:{type:String, maxlength:254},
      productURL:{type:String, maxlength:1024}
  }
})
const Gift = mongoose.model('Gift', giftSchema)

export default Gift