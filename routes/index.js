var express = require('express');
var router = express.Router();

var BotService = require('../services/botService');

/* GET dashboard page. */
router.get('/', function(req, res) {
  res.render('pages/login');
});

// /* GET dashboard page. */
// router.get('/signup', function(req, res) {
//   res.render('pages/signup');
// });


/* GET dashboard page. */
router.get('/dashboard', function(req, res) {
  BotService.getDashboardDetails(callback => {
    res.render('pages/dashboard', {data: callback}); 
  });
});

router.get('/dashboard', function(req, res) {
  
    res.render('pages/dashboard'); 
  
});

/* GET dashboard page. */
router.get('/connect', function(req, res) {
  res.render('pages/connect');
});

/* GET all bots page. */
router.get('/allbots', function(req, res) {
  BotService.getAllBotDetail(function(callback) {
    res.render('pages/allbots', { bots : callback });
  });
});

/* GET dashboard page. */
// router.get('/', function(req, res) {
//   res.render('pages/dashboard');
// });

/* GET dashboard page. */
// router.get('/', function(req, res) {
//   res.render('pages/dashboard');
// });

module.exports = router;
