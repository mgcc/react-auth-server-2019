
const authController = require('./auth-controller');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.send('This is the back end API~')
  })

  app.post('/signup', authController.signup)
  app.post('/login', authController.login)
  app.post('/checkifloggedin', authController.checkIfLoggedIn)
}