/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

'use strict';

$(document).ready(function() {
    this.displayMessageHistory = function(botId,  clientId) {
        var sendData = {
            botId: botId,
            clientId: clientId
        }

        $.ajax({
            method: 'POST',
            url: '/bot/dmhistory',
            data: sendData
        }).done(function(response) {
            for(var obj of response) {
                console.log(obj);
                // $('div#chatContent.content').append( '<p>' +  obj.message + '</p>' );

                $('div#chatContent.content').append(' <div style="max-width: 80%; float: left; display:block;"> ' + 
                                                            '<span style="font-size: 12px; color: black;">' +
                                                                '<strong>' + obj.messager_name + '</strong> 11:57 AM ' +
                                                            '</span>' +
                                                            '<div style="margin-top:0px">' +
                                                                '<label style="padding:8px; border-radius: 5px; background-color:rgb(242, 246, 249); font-size: 17px; color:black">' +
                                                                    obj.message +
                                                                '</label>' +
                                                            '</div>' +
                                                        '</div>');

                $('div#chatContent.content').append('<div style="height:55px;"></div>');

                $('div#chatContent.content').append('<div style="float: right; max-width: 80%; display:block;">' +
                                                        '<span style="font-size: 12px; color: black;">' +
                                                            '<strong>' + obj.botname + '</strong> 11:57 AM' +
                                                       '</span>' +
                                                        '<div style="margin-top:0px">' +
                                                            '<label style="padding:8px; border-radius: 5px; background-color: rgb(219, 244, 253); font-size: 17px; color:black">' +
                                                                obj.reply +
                                                            '</label>' +
                                                        '</div>' +
                                                    '</div>');

                $('div#chatContent.content').append('<div style="height:55px;"></div>');




                // $('div#chatContent.content').append( '<p>' + obj.reply + '</p>'  );
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
});