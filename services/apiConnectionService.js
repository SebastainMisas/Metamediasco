// Api connection service => apiConnectionService.js
'use strict';
  
var config = require('../_core/config');
// var threadService = require('../models/thread');
var { StaticPool  } = require('node-worker-threads-pool');
// var Client = require('instagram-private-api').V1;
// var storage = new Client.CookieFileStorage('./_core/someuser.json');
var globalsession = {};
// ____________EventEmitter______
// var EventEmitter = require('events');

// class MyEmitter extends EventEmitter {}

// var myEmitter = new MyEmitter();
// // increase the limit
// myEmitter.setMaxListeners(1000);
// console.log(myEmitter.getMaxListeners());
// ____________EventEmitter______
var apiConnectionService = {};

/*
* apiConnectionService.saveHascreateSessiontags
* @params
*       username
*       password
*/
// apiConnectionService.createSession = function (username, password, callback) {
//     var device = new Client.Device(username);
//     Client.Session.create(device, storage, username, password)
//         .then(async function (session) {
//             if(session){ 
//                 globalsession = session;
//                 callback( {messege: "OK", data: session});
              
//                 // console.log(session.cookieStore.storage.idx);
//                 // var obj = session.cookieStore.storage.idx;

//                 async function getmsg(){
//                             let feed = new Client.Feed.Inbox(session, 15);
//                             let allmsg = await  feed.get();
//                             // console.log();
//                             let allmsgCounter = allmsg.length;
//                             let messageuserMsg = ""; // Bot Owner last Msg
//                             let messageuserId = "";  // Bot Msg Id
//                             let responserId = "";    // Responser Id
//                             function getmsgLoop(){
//                                 allmsgCounter--;

//                                 allmsg[allmsgCounter].items.forEach((messageuser => {
//                                     messageuserMsg = messageuser._params.text;
//                                     messageuserId = messageuser._params.userId;
//                                 }));
//                                 allmsg[allmsgCounter].accounts.forEach((messageresponser => {
//                                     responserId = messageresponser.pk;
                                    
//                                 }));
                               
//                                 // console.log(allmsg[allmsgCounter].items);
//                                 // console.log(allmsg[allmsgCounter].accounts);
//                                 if(messageuserId == responserId){
//                                     console.log("_____Reply Msg____");
//                                     console.log(messageuserMsg);
//                                         (async () => {
//                                         const response = await new StaticPool({
//                                             size: 100,
//                                             task: function(n) {
//                                                 return n;
//                                             }
//                                         }).exec(responserId);
//                                             Client.Thread.configureText(session, response, "My third reply using Api hehe")
//                                                 .then(function(threads) {
//                                                     var thread = threads[0];
//                                                     // thread.broadcastText();
//                                                     console.log(thread);
//                                                 });
//                                       })();
//                                 }
//                                 if (allmsgCounter > 0)
//                                     setTimeout(getmsgLoop, 1000); 
//                             }
//                             // getmsgLoop();
         
//                             console.log("_____getmsg____");
//                             // setTimeout(getmsg,5000);
//                 }

               
//                 // getmsg()
            
//             } else {
//                 callback({
//                     messege: "Session is not good"
//                 });
//             }
//         }) 
        
// }
/*
* apiConnectionService.postComment
* @params
*       botid
*       hastags
*/
// apiConnectionService.postComment = function (data, callback){

//     var arrayComment = data.comment.split(",");
//     var arrayHastag = data.hastag.split(",");
//     var i = arrayHastag.length;
    
//     async function postComment() {
//         i--; 
        
//         let hastag = arrayHastag[i].trim();
//         let feedhas = new Client.Feed.TaggedMedia(globalsession, hastag);
//         console.log("_____________feedhas");
//         let results = await feedhas.get();
//         let counter = results.length;
//         console.log(counter);
//         function loopcomment(){
//             let randomComment = arrayComment[Math.floor(Math.random() * arrayComment.length)];
//             counter--;
//             let media_id = results[counter].caption.media_id;
//             Client.Comment.create(globalsession, media_id, randomComment).
//             then(function(res){
//                 console.log("_____comment______"+media_id);
//             })
//             if (counter > 0)
//                 setTimeout(loopcomment, 30000);  
//         }

//         // loopcomment();
//         if (i > 0)
//             setTimeout(postComment, 000); 
//     }
    

//     // postComment();
    
// }
module.exports = apiConnectionService;




