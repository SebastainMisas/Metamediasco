// Bot controller
'use strict';

var UserService = require('../services/userService'),
    UserModel = require('../models').User;

// Define user controller.
var UserController = {};

UserController.signup = function(req, res) {
    if (req.body.code != '5826') {
        res.status(404).json({
            message: 'Invalid create your account.'
        });
    } else {
        if(!req.body.email || !req.body.password) {

        } else {
            UserModel.findAll({
                where: {
                    email: req.body.email
                }
            }).then(function(users) {
                if(users.length == 0) {
                    UserService.hashPassword(req.body.password, hash => {
                        var newUser = {
                            username: req.body.email.split('@')[0],
                            firstname: req.body.firstName,
                            lastname: req.body.lastName,
                            password:  hash,
                            email: req.body.email,
                            role: 1
                        }
                        
                        UserModel.create(newUser)
                            .then(function(user) {
                                if(user) {
                                    res.status(201).json({
                                        message: 'Created your account.'
                                    });
                                }                                 
                            })
                            .catch(function(error) {
                                console.log('Create New User Error: ' + error);
                            });
                    });
                }
            }).catch(function(error) {
                console.log('Find user error: ' + error);
            });
        }
    }
}

/**
 * 
 * @param {OBJECT} req
 * @param {OBJECT} res
 */
UserController.login = function(req, res) {
    console.log(req.body);
    UserModel.findOne({
        where: {
            username: req.body.userName.split('@')[0],
        }
    }).then(function(user) {
        if(user) {
            UserService.comparePassword(req.body.password, user.dataValues.password, res => {
                if(res == true) {
                    console.log(res);
                } else {
                    res.status(404).json({
                        message: 'Invalid your authentication'
                    });
                }
            });
        }
    }).catch(function(error) {
        console.log('Fetch User Error: ' + error);
    });
}

module.exports = UserController;