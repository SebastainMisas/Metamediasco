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
    var userName = $('input#email.form-control'),
        password = $('input#password.form-control');

    $('form').submit(function(event) {
        var sendData = {
            userName: userName.val(),
            password: password.val()
        }

        console.log(sendData);
        $.ajax({
            method: 'POST',
            url: '/user/login',
            data: sendData
        }).done(function(response) {
            console.log(response);
        }).catch(function(error){
            console.log(error);
        });
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });
});