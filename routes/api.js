// Api application routing using Express.Router()
'use strict';
 
var express = require('express');
var ApiController  = require('../controllers/apiContrl');
// Sett Routing 
var router = express.Router();

// connect page => to instagram by ajax.
// router.post('/connectinstagram', ApiController.connectToinstagram);
// router.post('/savetags', ApiController.saveHastags)
// router.get('/savecomment',ApiController.saveComment)
// router.get('/savereply',ApiController.saveReply)
// router.get('/savemaxcmmdaily', ApiController.saveMaxCmmDaily)
// router.get('/postcomment', ApiController.postComment)
module.exports = router;