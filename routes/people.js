'use strict'

import { Router } from 'express'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Person from '../models/Person.js'
import User from '../models/User.js'
import authenticate from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
 
  const people = await Person.find(
                                    {
                                      $or:[
                                            {owner: req.user._id},
                                            {sharedWith:{$elemMatch:{$eq:req.user._id}}}
                                          ]
                                    })

  
  res.json({data: people.map(person => formatResponseData('people', person.toObject()))})
})

router.post('/', authenticate, sanitizeBody, async (req, res) => {

    
    try{
      
      let newPerson = new Person(req.sanitizedBody)    
      await newPerson.save()    
      res.status(201).json({data: formatResponseData('people', newPerson.toObject())})

    }catch(err){

      sendNotAbleToPostError(res)
    }

})

router.get('/:id', authenticate, async (req, res) => {

  
    try {
      const person = await Person.findById(req.params.id)
      if(!person){
          throw new Error('Resource not found')
      }
      if(person.owner == req.user._id || person.sharedWith.includes(req.user._id)==true){

        res.json({data: formatResponseData('people', person.toObject())})
      }else{
        return NotTheOwnerError(res)
      }
    }catch(err) {
      sendResourceNotFound(req, res)
    }
})


router.patch('/:id', authenticate, sanitizeBody, async (req, res) => {
  const currentPerson = await Person.findById(req.params.id)
  if(currentPerson.owner == req.user._id || currentPerson.sharedWith.includes(req.user._id)==true){
    try {      
      const person = await Person.findByIdAndUpdate(
        req.params.id,
      
        { ...req.sanitizedBody},
        {
          new: true,
          runValidators: true
        }
      )        

      if (!person) throw new Error('Resource not found')        
      res.json({data: formatResponseData('people', person.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
    }    
  }else{
    return NotTheOwnerError(res)
  }     
      
  })

router.put('/:id', authenticate, sanitizeBody, async (req, res) => {
  const currentPerson = await Person.findById(req.params.id)
  if(currentPerson.owner == req.user._id || currentPerson.sharedWith.includes(req.user._id)==true){
    
    try {    
      const person = await Person.findByIdAndUpdate(
        req.params.id,      
        {...req.sanitizedBody}, 
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      )
      if (!person) throw new Error('Resource not found')
      res.json({data: formatResponseData('people', person.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
      
    }}else{
      return NotTheOwnerError(res)
    } 

  }    
)

// router.delete('/:id', authenticate, async (req, res) => {

//     const user = await User.findById(req.user._id)
//     if(user.isAdmin === false){
//       return sendNotAdminError(res)
//     }
//     try {
//       const student = await Student.findByIdAndRemove(req.params.id)
//       if (!student) throw new Error('Resource not found')
//       res.json({data: formatResponseData('students', student.toObject())})
//     } catch (err) {
//       sendResourceNotFound(req, res)
//     }
// })

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'cars'
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
    const {id, ...attributes} = resource
    return {type, id, attributes}
}

function sendResourceNotFound(req, res){
  res.status(404).send({
    errors: [
      {
        status: '404',
        title: 'Resource does not exist',
        description: `We could not find a student with id: ${req.params.id}`
      }
    ]
  })
}

function sendNotAbleToPostError(res){
  res.status(400).send({
    errors: [
      {
        status: '400',
        title: 'Problem with the data',
        description: `We were not able to save your data`
      }
    ]
  })
}

function sendNotAdminError(res){
  res.status(403).json({
    errors: [
      {
        status: '403',
        title: 'Only admin is allowed to do that.'
      }
    ]
  })
}

function NotTheOwnerError(res){
  res.status(403).json({
    errors: [
      {
        status: '403',
        title: 'You are not the owner or this person was not shared with you'
      }
    ]
  })
}

export default router