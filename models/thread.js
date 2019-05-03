'use strict'
var Client = require('instagram-private-api').V1;
var { StaticPool  } = require('node-worker-threads-pool');
var threadService = {};
threadService.createThread = function (){
        
        // Thread FUnction send msg
        const pool = new StaticPool({
            size: 4,
            task: function(n) {
                return n;
            // async function sendmsg(){
            
                // Client.Thread.configureText(session, n, "My first reply using Api hehe")
                //     .then(function(threads) {
                //         var thread = threads[0];
                //         //thread.broadcastText(text);
                //         // console.log("_________see conversation___________");
                //         // console.log(thread.items) // -> see conversation
                //     });
            
                
            // sendmsg()
            }
        
        });

    //   console.log('idle threads: ', pool.idleThreads());
    //   pool.destroy();
}
module.exports = threadService;
              
         