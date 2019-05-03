// Api Contollers
'use strict';
var config = require("../_core/config");
var apiConnectionService = require("../services/apiConnectionService");
var Model = require("../models/model");
var ApiController = {};
var session = {};
ApiController.connectToinstagram = function(req, res) {
    
    apiConnectionService.createSession(req.body.username, req.body.password,  (callback) => {
       
        if(callback.messege == "OK")
        {   
            let session = callback.data; 

           
            // console.log(session);
            Model.createBot(req.body.botname, req.body.username, req.body.password, req.body.resdaly, (callback) => {
                if(callback.messege == "ok")
                {   
                    res.cookie(config.cookie.SESSION_COOKIE_BOTNAME, callback.Botid , config.cookieConfig);
                    // res.cookie(config.cookie.SESSION_COOKIE_BOTINSTSESSION, session , config.cookieConfig);
                    res.send('{"success" : "Connected", "status" : 200}');
                }
            })
              
           
        }   
        else  res.send('{"Error" : "Desconnected", "status" : 400}');
        })
    }
/*
* AbortController.saveHastags
* @params
*       req.body.data : hastags ex: (horse,girl)
*/
ApiController.saveHastags = function(req, res) { 
    console.log(req.body.data);
    let Botid = req.signedCookies.BotCookie; // get signed cookies
    console.log("________cookie_________");
    Model.saveHastags(req.body.data, Botid, (callback) => {
        if(callback.messege  == 'ok')   res.send('{"success" : "Inserted", "status" : 200}');
        if(callback.messege !== 'ok')   res.send('{"error" : "Non Inserted", "status" : 400}');
    });
};
/*
* AbortController.saveComment
* @params
*       req.query.comment : ex: "Nice to meet you"
*/
ApiController.saveComment = function(req, res){
    // console.log("________req.body_________");
    // console.log(req.query.comment);
    let comment = req.query.comment;
    let Botid = req.signedCookies.BotCookie; // get signed cookies
    Model.saveComment(comment, Botid, (callback) => {
        if(callback.messege  == 'ok')   res.send('{"success" : "Inserted", "status" : 200}');
        if(callback.messege !== 'ok')   res.send('{"error" : "Non Inserted", "status" : 400}');
    });
}
/*
* AbortController.saveReply
* @params
*       req.query.comment : ex: "Nice to meet you"
*/
ApiController.saveReply = function (req, res){
    let comment = req.query.comment;
    let Botid = req.signedCookies.BotCookie; // get signed cookies
    // console.log(comment);
    Model.saveReply(comment, Botid, (callback) => {
        if(callback.messege  == 'ok')   res.send('{"success" : "Inserted", "status" : 200}');
        if(callback.messege !== 'ok')   res.send('{"error" : "Non Inserted", "status" : 400}');
    });
}
/*
* AbortController.saveMaxCmmDaily
* @params
*       req.query.comment : ex: "Nice to meet you"
*/
ApiController.saveMaxCmmDaily = function (req, res){
    let comment = req.query.comment;
    let Botid = req.signedCookies.BotCookie; // get signed cookies
    Model.saveMaxCmmDaily(comment, Botid, (callback) => {
        if(callback.messege  == 'ok')   res.send('{"success" : "Inserted", "status" : 200}');
        if(callback.messege !== 'ok')   res.send('{"error" : "Non Inserted", "status" : 400}');
    });
}
ApiController.postComment = function(req, res){
    let Botid = req.signedCookies.BotCookie; // get signed cookies
  
    Model.getCommentBydb(Botid, (callback) => {
       
        if(callback.messege == 'ok')  {
            let commentofdb = callback.data;
            // console.log(commentofdb);
            
            apiConnectionService.postComment(commentofdb, (callback) => {

            });
        };
        if(callback.messege !== 'ok')   res.send('{"error" : "Non Inserted", "status" : 400}');
    });
 
}


module.exports = ApiController;