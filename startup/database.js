'use strict'
import mongoose from 'mongoose'

export default function () {
mongoose.connect('mongodb://localhost:27017/Giftr', {
    useNewUrlParser: true
  })
  .then(() => console.log('Connected to MongoDB ...'))
  .catch(err => {
    console.error('Problem connecting to MongoDB ...', err.message)
    process.exit(1)
  })

}