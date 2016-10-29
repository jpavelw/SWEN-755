"use strict"

var Sequelize = require('sequelize');
var sequelize = new Sequelize("sqlite://users.db");

exports.User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    roleid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sessionid: {
        type: Sequelize.STRING
    }
});

exports.init = function(){
    User.sync({force: true}).then(function(){
        console.log("User table created");
        User.create({username: "jai", password: "12345", roleid: "ADM"}).then(function(){
            console.log("User admin created");
            User.create({username: "arun", password: "09876", roleid: "SUP"}).then(function(){
                console.log("User supervisor created");
            })
        })
    }).catch(function(error){
        console.log(error);
    });
};
