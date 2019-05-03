// Api connection service => apiConnectionService.js
'use strict';
  
var config = require('../_core/config');
var Client = require('instagram-private-api').V1;
var storage = new Client.CookieFileStorage('./_core/someuser.json');
var { StaticPool  } = require('node-worker-threads-pool');



var apiConnectionService = {};
/*
* apiConnectionService.saveHascreateSessiontags
* @params
*       username
*       password
*/
apiConnectionService.createSession = function (username, password, callback) {
    var device = new Client.Device(username);
    Client.Session.create(device, storage, username, password)
        .then(async function (session) {
            if(session){
                // console.log(session.cookieStore.storage.idx);
                var obj = session.cookieStore.storage.idx;
                async function postComment() {
    
                    let feed = new Client.Feed.TaggedMedia(session, "okhahaha");
                    let results = await feed.get();
                    let counter = results.length;
                    function loopcomment(){
                                    counter--;
                                    let media_id = results[counter].caption.media_id;
                                    Client.Comment.create(session, media_id, 'good').
                                    then(function(results){
                                        console.log("_____comment______"+media_id);
                                    })
                                    if (counter > 0)
                                        setTimeout(loopcomment, 30000);  
                        }
                    loopcomment();
                }
                
                // Thread FUnction send msg
                const pool = new StaticPool({
                    size: 4,
                    task: function(n) {
                       
                 
                     
                    }
                  
                });
                     //   console.log('idle threads: ', pool.idleThreads());
                     //   pool.destroy();
                  
             
                // postComment();

                async function getmsg(){
                            let feed = new Client.Feed.Inbox(session, 15);
                            let allmsg = await  feed.get();
                            // console.log();
                            let allmsgCounter = allmsg.length;
                            let messageuserMsg = ""; // Bot Owner last Msg
                            let messageuserId = "";  // Bot Msg Id
                            let responserId = "";    // Responser Id
                            function getmsgLoop(){
                                allmsgCounter--;

                                allmsg[allmsgCounter].items.forEach((messageuser => {
                                    console.log(`${messageuser._params.text} from ${messageuser._params.userId}`);
                                    messageuserMsg = messageuser._params.text;
                                    messageuserId = messageuser._params.userId;
                                }));
                                allmsg[allmsgCounter].accounts.forEach((messageresponser => {
                                    console.log(`${messageresponser.username} from ${messageresponser.pk}`);
                                    responserId = messageresponser.pk;
                                    
                                }));
                                if(messageuserId == responserId){
                                    console.log("______Notification__from__"+responserId);
                                    console.log(messageuserMsg);
                                    // _____Thread Create_______
                                    (async () => {
                                        const res = await pool.exec(responserId);
                                        console.log(`result${responserId}:`, res);
                                      })();
                                }
                                if (allmsgCounter > 0)
                                    setTimeout(getmsgLoop, 1000); 
                            }
                            getmsgLoop();
         
                            
                }
                getmsg()
            
            } else {
                callback({
                    messege: "Session is not good"
                });
            }
        }) 
        
}
/*
* apiConnectionService.postComment
* @params
*       botid
*       hastags
*/
apiConnectionService.postComment = function (botid, hastags, callback){
// ______________________________________________________

 //_______________________________________________________
}
module.exports = apiConnectionService;

async function sendmsg(){
    Client.Thread.configureText(session, responserId, "My first reply using Api hehe")
    .then(function(threads) {
        var thread = threads[0];
        //thread.broadcastText(text);
        // console.log("_________see conversation___________");
        // console.log(thread.items) // -> see conversation
    });
}

sendmsg()








comment create

let feed = new Client.Feed.TaggedMedia(session, respostcomm);
                
let results = await feed.get();console.log(results);
let counter = results.length;
function loopcomment(){
    counter--;
    let media_id = results[counter].caption.media_id;
    Client.Comment.create(session, media_id, randomComment).
    then(function(results){
        console.log("_____comment______"+media_id);
    })
    if (counter > 0)
        setTimeout(loopcomment, 30000);  
}

// loopcomment();










