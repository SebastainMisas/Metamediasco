// Bot Service.
'use strict';
var Client = require('instagram-private-api').V1,
    path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:Rango941001top@@@@localhost:5433/instagram_dm_bot');

var UserModel = require('../models').User,
    BotModel = require('../models').Bot,
    CommentModel = require('../models').Comment,
    ReplyModel = require('../models').Reply,
    ResponseHistory = require('../models').ResponseHistory,
    SettingModel = require('../models').Setting;

// Define Bot Service module.
var BotService = {};

BotService.validateBot = validateBot;
BotService.getBotDetail = getBotDetail; 
BotService.getCommentByBotId = getCommentByBotId;
BotService.getCommentAllDataByBotId = getCommentAllDataByBotId;
BotService.getMediaIdByHashtag = getMediaIdByHashtag;
BotService.commitPostsByMediaId = commitPostsByMediaId;
BotService.getDirectMessageByBotId = getDirectMessageByBotId;
BotService.getResposerDataFromInbox = getResposerDataFromInbox;
BotService.replyToUserByRespnserId = replyToUserByRespnserId;
BotService.getReplyDirectMessageHistoryByBotId = getReplyDirectMessageHistoryByBotId;
BotService.storeReplyDirectMessageHistory = storeReplyDirectMessageHistory;
BotService.getAllBotDetail = getAllBotDetail;
BotService.getDashboardDetails = getDashboardDetails;
BotService.getBotDirectMessageHistroy = getBotDirectMessageHistroy;

/**
 * Validate Bot to create new bot with username and password.
 * @param {string} name 
 * @param {string} password 
 * @param {object} callback 
 */
function validateBot(name, password, callback) {
    var cookieFileURL = '../cookies/' + name + '.json',
        storage = new Client.CookieFileStorage(path.join(__dirname, cookieFileURL)),
        device = new Client.Device(name);

    Client.Session.create(device, storage, name, password)
        .then(async function(session) {
            if(!session) {
                callback({
                    flag: false,
                    type: 'CreateError'
                })
            } else {
                callback({
                    flag: true,
                    type: 'Success',
                    session: session
                });
            }
        })
        .catch(function(reject) {
            callback({
                flag: false,
                type: reject.name
            });
        });

}

/**
 * get current bot detail.
 * @param {object} botId 
 * @param {object} callback 
 */
function getBotDetail(botId, callback) {
    var botId = botId,
        potentialBotId = { where: { id: botId, status: 1 } };
    
    BotModel.findOne(potentialBotId)
        .then(function(bot) {
            callback(bot.dataValues);
        })
        .catch(function(error) {
            console.log('Get bot Detail by Id error: ' + error);
        });
}

/**
 * get current bot's inputed comments.
 * @param {object} botId 
 * @param {array} callback 
 */
function getCommentByBotId (botId, callback) {
    var botId = botId,
        potentialBotId = { where: { bot_id: botId } };

    CommentModel.findAll(potentialBotId)
        .then(function(comments) {
            var arrComments = [];
            for (var obj of comments) {
                arrComments.push(obj.dataValues.comment);
            }
            callback(arrComments);

            arrComments = [];
        })
        .catch(function(error) {
            console.log('Get comment by id error: ' + error);
        });
}

/**
 * 
 * @param {*} botId 
 * @param {*} callback 
 */
function getCommentAllDataByBotId(botId, callback) {
    var botId = botId,
    potentialBotId = { where: { bot_id: botId } };

    CommentModel.findAll(potentialBotId)
        .then(function(comments) {
            var arrComment = []
            for(var obj of comments) {
                var sendData = {
                    id: obj.dataValues.id,
                    comments: obj.dataValues.comment
                }

                arrComment.push(sendData);
            }
            callback(arrComment);

            arrComment = [];
        })
        .catch(function(error) {
            console.log('Get comment by id error: ' + error);
        });
}

/**
 * get Replies from database.
 * @param {integer} botId 
 * @param {array} callback 
 */
function getDirectMessageByBotId(botId, callback) {
    var botId = botId;

    ReplyModel.findAll({
            where: { 
                bot_id: botId 
            }
        })
        .then(function(replies) {
            var arrReplies = [];
            for(var obj of replies) {
                var sendData = {
                    id: obj.dataValues.id,
                    message: obj.dataValues.message
                }
                arrReplies.push(sendData);
            }

            callback(arrReplies);

            arrReplies = [];
        })
        .catch(function(error) {
            console.log('Get message by id error: ' + error);
        });
}

/**
 * get media_id with hashtag.
 * @param {string} hashtag 
 * @param {array} callback 
 */
function getMediaIdByHashtag(session, hashtag, callback) {
    var arrMediaId = [];
    var hashtag = hashtag;
    var feed = new Client.Feed.TaggedMedia(session, hashtag);

    var pFeed = new Promise(function(resolve, reject) {
        return resolve(feed.get());
    });

    pFeed.then(function(results) {
        for(var obj of results) {
            arrMediaId.push(obj.caption.media_id);
        }

        callback(arrMediaId);

        arrMediaId = [];
    });
}

/**
 * commit Posts using comments busing media_id.
 * @param {object} session 
 * @param {string} media_id
 * @param {string} comment 
 * @param {flag} callback 
 */
function commitPostsByMediaId(session, media_id, comment, callback) {
    Client.Comment.create(session, media_id, comment)
        .then(function(response) {
            callback(response);
        })
        .catch(function(error) {
            console.log('Set comment error: ' + error);
        });
}

/**
 * get Message from API using promise.
 * @param {object} session 
 * @param {object} callback 
 */
function getResposerDataFromInbox(session, callback) {
    var feed = new Client.Feed.Inbox(session);

    var pFeed = new Promise(function(resolve, reject) {
        return resolve(feed.get());
    });

    pFeed.then(function(results) {
        var countResults = results.length;

        async function getNewMessages() {
            countResults--;
            var userId;
            var messageFromUser = '';
            var responserId;


            results[countResults].items.forEach(element => {
                messageFromUser = element._params.text;
                userId = element._params.userId;
            });

            results[countResults].accounts.forEach(element1 => {
                responserId = element1.pk;
            });
          
            if(userId == responserId) {
                var replyData = {
                    message: messageFromUser,
                    id: responserId
                }

                callback(replyData);
            }

            if(countResults > 0) {
                // setTimeout(getNewMessages, 3000);
                getNewMessages();
            }
        }
        getNewMessages();

    });
}

/**
 * Reply to user by responser id.
 * @param {array} session 
 * @param {integer} id 
 * @param {string} message 
 * @param {integer} callback 
 */
function replyToUserByRespnserId(session, id, message, callback) {
    Client.Thread.configureText(session, id, message)
        .then(function(response) {
            for(var obj of response) {
                var sendData = {
                    id: obj.accounts[0].pk,
                    name: obj.accounts[0].username
                }
                callback(sendData);
            }
        })
        .catch(function(error) {
            console.log('Direct Message error: ' + error);
        });
}

/**
 * 
 * @param {INTEGER} botId 
 * @param {INTEGER} messagerId 
 * @param {STRING} messagerName 
 * @param {STRING} message 
 * @param {INTEGER} replyId 
 * @param {OBJECT} callback 
 */
function storeReplyDirectMessageHistory(botId, messagerId, messagerName, message, replyId, callback) {
    var newResponseHitory = {
        bot_id: botId,
        messager_id: messagerId,
        messager_name: messagerName,
        message: message,
        reply_id: replyId
    }
    
    ResponseHistory.create(newResponseHitory)
        .then(function(responseHistory) {
            callback(responseHistory.dataValues);
        })
        .catch(function(error) {
            console.log('Save response history error: ' + error);
        });
}

/**
 * Get all bot's detail.
 * @param {array} callback 
 */
function getAllBotDetail(callback) {
    BotModel.findAll({ where: { status: 1 } })
        .then(function(bots) {
            if (bots.length > 0) {
                var countBots = bots.length;
                var arrySendData = [];
                async function insertBotDetail() {
                    countBots--;
                    
                    var objSendData = {
                        id: bots[countBots].dataValues.id,
                        userId: bots[countBots].dataValues.user_id,
                        botName: bots[countBots].dataValues.botname,
                        accountName: bots[countBots].dataValues.name,
                        password: bots[countBots].dataValues.password,
                        delay: bots[countBots].dataValues.delay,
                        filters: bots[countBots].dataValues.filters,
                        comments: {},
                        replies: {}

                    }
                    
                    ReplyModel.findAll({where: { bot_id: bots[countBots].dataValues.id}})
                        .then(function(replies) {
                            var messages = [];
                            for(var replyObj of replies) {
                                messages.push({
                                    id: replyObj.dataValues.id,
                                    message: replyObj.dataValues.message
                                });                            
                            }
                            objSendData.replies = messages;
                            messages = [];

                        })
                        .catch(function(error) {
                            console.log('Fetch Reply data error: ' + error);
                        });

                    CommentModel.findAll({ where: { bot_id: bots[countBots].dataValues.id } })
                        .then(function(comments) {
                            var arrComments = [];
                            for(var obj of comments) {
                                arrComments.push({
                                    id: obj.dataValues.id,
                                    comment: obj.dataValues.comment
                                })
                            }

                            objSendData.comments = arrComments;
                            arrComments = [];
                        })
                        .catch(function(error) {
                            console.log('Fetch Comments data error: ' + error);
                        });

                    arrySendData.push(objSendData);

                    if(countBots > 0) {
                        insertBotDetail();
                    } else {
                        setTimeout(()=>{
                            callback(arrySendData);

                            arrySendData = [];
                        }, 500);
                    }
                }
                insertBotDetail();
            } else {
                callback([]);
            }

            
        })
        .catch(function(error) {
            console.log('Get initialize bot data error: ' + error);
        });
}

/**
 * get reply history by botId
 * @param {NUMBER} botId 
 * @param {INTEGER} callback 
 */
function getReplyDirectMessageHistoryByBotId(botId, callback) {
    ResponseHistory.findAndCountAll({
        where: {
            bot_id: botId
        }
    })
    .then(function(result) {
        callback(result.count);
    })
    .catch(function(error) {
        console.log('Get Reply Direct Message History By Bot ID error: ' + error);
    });

}

/**
 * 
 * @param {OBJECT} callback 
 */



function getDashboardDetails(callback) {
    var selectQuery = 'select a.id, \
                        a.botname, \
                        c.id, \
                        c.username,  \
                        d.messager_id, \
                        d.messager_name, \
                        max(d."createdAt"), \
                        count(d.message) \
                    from public."Bots" a, \
                    public."Replies" b, \
                    public."Users" c, \
                    public."ResponseHistories" d \
                    where a.id = b.bot_id \
                    and a.id = d.bot_id \
                    and a.user_id = c.id \
                    and c.id = ? \
                    group by a.id, a.botname, c.id, c.username, d.messager_id, d.messager_name';

    sequelize.query(selectQuery, { replacements: ['1'], type: sequelize.QueryTypes.SELECT })
        .then(function(result) {
            var sendData = [];
            for(var obj of result) {
                convertTime(obj.max, function(callback) {
                    var last = callback;
                    var sendObj = {
                        id: obj.id,
                        botName: obj.botname,
                        messagerId: obj.messager_id,
                        messagerName: obj.messager_name,
                        last: last,
                        count: obj.count
                    }

                    sendData.push(sendObj);
                });
            }
            console.log(sendData);
            callback(sendData);

            sendData = [];
        });
}

function getBotDirectMessageHistroy(botId, clientId, callback) {
    var selectQuery =   'SELECT \
                            a.id as "bot ID", \
                            a.botname as botName, \
                            d.messager_id, \
                            d.messager_name, \
                            d."createdAt", \
                            d.message, \
                            b.message as reply\
                        FROM \
                            public."Bots" a, \
                            public."Replies"  b, \
                            public."Users"       c,  \
                            public."ResponseHistories" d \
                        WHERE \
                            a.id = b.bot_id \
                            and a.id = d.bot_id \
                            and a.user_id = c.id \
                            and b.id = d.reply_id \
                            and c.id = ? \
                            and a.id = ? \
                            and d.messager_id = ? \
                        ORDER BY \
                            d."createdAt"';
    
    sequelize.query(selectQuery, { replacements: ['1', botId, clientId ], type: sequelize.QueryTypes.SELECT})
        .then(function(result) {
            callback(result);
        }).catch(function(error) {
            console.log(' Get Bot Direct Message Error: ' + error); 
        });
}


function convertTime(mili, callback) {
    var delta = parseInt((parseInt(new Date().getTime()) - parseInt(new Date(mili).getTime())) / ( 1000 * 60 ));

    if( delta < 60 ) {
        callback(delta + ' minutes ago'); 
    } else if( 60 < delta < 3600) {
        delta = parseInt(delta / 60)
        callback(delta + ' hours ago');
    } else if( 3600 < delta < 86400 ) {
        delta = parseInt(delta /  86400);
        callback(delta + ' days ago');
    }
}

// Export Bot Service module.
module.exports = BotService;