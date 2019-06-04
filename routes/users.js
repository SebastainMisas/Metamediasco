var express = require('express');
var router = express.Router();

var UserController = require('../controllers/userController');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST users signup. */
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

module.exports = router;
