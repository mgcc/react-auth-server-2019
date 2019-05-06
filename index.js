
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/react-auth', { useNewUrlParser: true }, (err) => { if (err) { console.log('Error connecting to MongoDB') } })

// Register User model
require('./models/user')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods' ,'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

// Declare Routes
require('./routes')(app)

app.listen(3001, (err) => { if (!err) { console.log('Server listening at port 3001') } } )