// User Service.
'use strict';
var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    jwt = require('passport-jwt');

// Define user services.
var UserService = {};

// User Service sub functions.
UserService.hashPassword = hashPassword;
UserService.comparePassword = comparePassword; 

/**
 * Hash password to encode all of detections.
 * @param {STRING} password 
 * @param {STRING} callback 
 */
function hashPassword(password, callback) {
    bcrypt.hash(password, 10)
        .then(function(hash) {
            callback(hash);
        });
}

/**
 * Compare password using bcrypt
 * @param {STRING} password 
 * @param {TOKEN} hash 
 * @param {flag} callback 
 */
function comparePassword(password, hash, callback) {
    bcrypt.compare(password, hash, function(error, response) {
        if(response && !error) {
            callback(response);
        } else {
            callback(error);
        }
    });
}

module.exports = UserService;