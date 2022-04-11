const express = require('express')
const User = require('../../models/User.js')
const sanitizeBody = require('../../middleware/sanitizeBody.js')
const authenticate = require('../../middleware/auth.js')
//const AuthAttempt = require('../../models/AuthenticateAttempts')

const router = express.Router()

// Register a new user
router.post('/users', sanitizeBody, async (req, res) => {
  try {
    let newUser = new User(req.sanitizedBody)
    const itExists = Boolean(await User.countDocuments({email: newUser.email}))
    if (itExists) {
      return res.status(400).json({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            detail: `Email address '${newUser.email}' is already registered.`,
            source: {pointer: '/data/attributes/email'}
          }
        ]
      })
    }
  
    await newUser.save()
    res.status(201).json(formatResponseData(newUser))
  } catch (err) {
  
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.'
        }
      ]
    })
  }
})

// Login a user and return an authentication token.
/*router.post('/tokens', sanitizeBody, async (req, res) => {

    const {email, password} = req.sanitizedBody
    // const loginSucceeded = {
    //                         userName:email,
    //                         ipAddress:req.ip,
    //                         didSucceed:true,
    //                         createdAt:Date.now()
    //                       };
    // const loginFailed = {
    //                       userName:email,
    //                       ipAddress:req.ip,
    //                       didSucceed:false,
    //                       createdAt:Date.now()
    //                     };
      const user = await User.authenticate(email, password)

      if (!user) {
        //const failedAttempt = new AuthAttempt(loginFailed)
        //await failedAttempt.save()
        return res.status(401).json({
          errors: [
            {
              status: '401',
              title: 'Incorrect username or password.'
            }
          ]
        })
      }    
      
      //const succeededAttempt = new AuthAttempt(loginSucceeded)
      //await succeededAttempt.save()
      res.status(201).json(formatResponseData({accessToken: user.generateAuthToken()}, 'tokens'))
})

// Get the currently logged-in user
router.get('/users/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json(formatResponseData(user))
})*/

function formatResponseData(payload, type = 'users') {
  if (payload instanceof Array) {
    return {data: payload.map(resource => format(resource))}
  } else {
    return {data: format(payload)}
  }

  function format(resource) {
    const {_id, ...attributes} = resource.toJSON ? resource.toJSON() : resource
    return {type, id: _id, attributes}
  }
}


module.exports = router