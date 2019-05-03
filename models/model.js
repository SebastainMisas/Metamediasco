// DB management model CRUD

var config = require("../_core/config");
var pg = require("pg");
var {Pool} = require("pg");
var conStr  = config.db.DATABASE_URL; 
var pool = new Pool({
    connectionString: conStr
});
var bcrypt = require('bcrypt');
var queryString = "";
 
var modelService = {};
/*
* modelService.createBot
* @params
*        botname  : string
*        username : string
*        password : string
*        resdaly  : int 
*/
modelService.createBot = function (botname, username, password, resdaly, callback) {

    password = bcrypt.hashSync(password, 5);
    queryString = "INSERT into public.bots (b_name, username, password, res_delay) VALUES ('"+botname+"','"+username+"','"+password+"','"+resdaly+"')";
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback("error");
            return
        }
        client.query(queryString, function(err, result) {
            done();
            if (err) {
                console.log(err);
            }else{
                let queryBotid = "SELECT id FROM bots WHERE b_name = '"+botname+"'";
                client.query(queryBotid, (err, res) => {
                    console.log(res.rows)
                    if (err) throw err
                    let Botid = res.rows[0].id;
                    // client.end()
                    console.log("______result_0_");
                    console.log(Botid);
                    callback({messege:"ok",Botid:Botid});
                })
                
            }
        });
    });
}
/*
* modelService.saveHastags
* @params
*       data  : array hastags 
*       Botid : cookie botid
*/
modelService.saveHastags = function(data, Botid, callback){
    
    queryString = "insert into hastags  (b_id, hastag) VALUES  ('"+Botid+"', '"+data+"')";
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            callback("error");
            return
        }
        client.query(queryString, function(err, result) {
            done();
            if (err)  console.log(err);
            callback({messege:"ok"});
            
        });
    });
}
/*
* modelService.saveComment
* @params
*       comment :  string comment 
*       Botid   :  cookie botid
*/
modelService.saveComment = function(comment, Botid, callback){
    queryString = "select b_id, comment  FROM comments WHERE b_id = " + Botid;
    pool.connect(function(err, client) {
        if(err) {
            console.log(err);
        } else {
            client.query(queryString, function(err, result) {
                if(err) {
                    console.log(err);
                } else {
                    if (result.rowCount > 0) {
                            let b_id = result.rows[0].b_id;
                            let oldcomment = result.rows[0].comment.trim();
                            let updateQuery = "UPDATE comments SET comment = concat('"+oldcomment+"',',', '"+comment+"') WHERE b_id = "+Botid;
                            client.query(updateQuery, (error, result) => {
                                if(error) {
                                    console.log(error);
                                } else {
                                    callback("ok");
                                }
                            });
                    } else {
                            let insertQuery = "INSERT INTO comments (b_id, comment) VALUES ('" + Botid + "','" + comment + "')";
                            client.query(insertQuery, (error, result) => {
                                if(error) {
                                    console.log(error);
                                } else {
                                    callback("ok");
                                }
                            });
                        // }
                    }
                }
            })
        }

    })
}
/*
* modelService.saveReply
* @params
*       replies :  string replies 
*       Botid   :  cookie botid
*/
modelService.saveReply  = function (replies, Botid, callback){
    queryString = "select b_id, replies  FROM replies WHERE b_id = " + Botid;
    pool.connect(function(err, client){
        if(err){
            console.log(err);
        }else{
            client.query(queryString, function(err, result){
               if(err){
                    console.log(err);
               } else {
                   console.log("____query_____");
                   console.log(result.rowCount);
                    if(result.rowCount > 0){
                            let b_id = result.rows[0].b_id;
                            let oldreplies = result.rows[0].replies.trim();
                            let updateQuery = "UPDATE replies SET replies = concat('"+oldreplies+"',',', '"+replies+"') WHERE b_id = "+Botid;
                            console.log("____query__1___");
                            console.log(updateQuery);
                            client.query(updateQuery, (error, result) => {
                                if(error) {
                                    console.log(error);
                                } else {
                                    callback("ok");
                                }
                            });
                    } else {
                        let insertQuery = "INSERT INTO replies (b_id, replies) VALUES ('" + Botid + "','" + replies + "')";
                        console.log("____query__2___");
                        console.log(insertQuery);
                        client.query(insertQuery, (error, result) => {
                            if(error) {
                                console.log(error);
                            } else {
                                callback("ok");
                            }
                        });
                    }
               }
            })
            
        }
    })
}
/*
* modelService.saveMaxCmmDaily
* @params
*       maxcmmdaily :  int maxcmmdaily 
*       Botid       :  cookie botid
*/
modelService.saveMaxCmmDaily = function (maxcmmdaily, Botid, callback){
    queryString = "update bots set maxcmmdaily = '"+maxcmmdaily+"' where id = '"+Botid+"'"; 
    // console.log("update");
    // console.log(queryString);
  
    pool.connect(function(err, client){
        if(err){
            console.log(err);
        }else{
            client.query(queryString, function(err, result){
                if(err){
                    console.log(err);
                } else {
                    callback('ok');
                }
            })
        }
    })  
}
modelService.getCommentBydb = function (Botid, callback){
    // queryString = "select comment from comments where b_id = '"+Botid+"'"; 
    queryString = "select a.comment, b.hastag from comments as A join  (Select * from hastags where b_id = '"+Botid+"') as b on  a.b_id = b.b_id "
    // console.log("update");
    // console.log(queryString);
  
    pool.connect(function(err, client){
        if(err){
            console.log(err);
        }else{
            client.query(queryString, function(err, result){
                if(err){
                    console.log(err);
                } else { 
                    callback({messege: "ok", data:result.rows[0]});
                }
            })
        }
    })  
}

module.exports = modelService;