'use strict'

import morgan from 'morgan'
import express from 'express'
import sanitizeMongo from 'express-mongo-sanitize'
import authRouter from './routes/auth/index.js'
import peopleRouter from './routes/people.js'
import giftsRouter from './routes/gifts.js'
import connectDatabase from './startup/database.js'

connectDatabase()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())
app.use('/api/people', peopleRouter)
app.use('/api/people', giftsRouter)

app.use('/auth', authRouter)

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`HTTP server listening on port ${port} ...`))