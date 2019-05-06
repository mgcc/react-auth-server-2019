const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// get model registered earlier
const User = mongoose.model('User')

exports.signup = (req, res) => {
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

  User.findOne({ email }, (err, user) => {
    // Check if email exists
    if (err || !user) {
      // Scenario 1: FAIL - User doesn't exist
      return res.send({ success: false })
    }

    // Check if password matches
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        return res.send({ success: false })
      }

      // Scenario 3: SUCCESS - time to create token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, 'THIS_IS_A_SECRET')

      // Return token to front end
      return res.send({ success: true, token, username: user.name })
    })
  })

}

exports.checkIfLoggedIn = (req, res) => {
  if (!req.cookies || !req.cookies.authToken) {
    // Scenario 1: FAIL - No cookies / No auth token sent
    return res.send({ loggedIn: false })
  }

  // Validate token if found
  return jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET', (err, decoded) => {
    if (err) {
      // Scenario 2: FAIL - Error validating token
      return res.send({ loggedIn: false })
    }

    const userId = decoded._id

    // Check if user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        // Scenario 3: FAIL - Failed to find user based on id inside token
        return res.send({ loggedIn: false })
      }

      // Scenario 4: SUCCESS - Token and user data are valid
      return res.send({ loggedIn: true })
    })
  })

}
