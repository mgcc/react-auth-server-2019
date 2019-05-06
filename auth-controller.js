const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Cookies = require('universal-cookie')

// get model registered earlier
const User = mongoose.model('User')


exports.signup = (req, res) => {
  console.log('received signup request')

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  newUser.save((err) => {
    if (err) return res.send({ success: false })
    else return res.send({ success: true })
  });
}

exports.login = (req, res) => {

  const email = req.body.email.trim()
  const password = req.body.password


  console.log('recieved login request')
  console.log(req.body)

  User.findOne({ email }, (err, user) => {
    // Check if email exists
    if (err || !user) {
      // FAIL - User doesn't exist
      return res.send({ success: false })
    }

    // check if password matches
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // FAIL - Wrong password
        return res.send({ success: false })
      }

      // Everything checks out, time to create token

      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, 'THIS_IS_A_SECRET')

      // return token
      return res.send({ success: true, token })
    })
  })


}

exports.checkIfLoggedIn = (req, res) => {
  console.log('COOKIES: ')
  console.log(req.cookies)

  if (!req.cookies || !req.cookies.authToken) {
    // no auth token
    return res.send({ loggedIn: false })
  }

  // validate token
  return jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET', (err, decoded) => {
    if (err) {
      return res.send({ loggedIn: false })
    }

    const userId = decoded._id

    // check if user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.send({ loggedIn: false })
      }

      return res.send({ loggedIn: true })
    })
  })

}
