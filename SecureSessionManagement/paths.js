var DB = require('./database');

var checksession = function(request, callback){
    var session = request.session;
    DB.User.findOne({where: {username: session.username}}).then(function(user){
        if(user){
            if(user.sessionid == session.id && user.roleid == session.roleid){
                 callback(true);
            } else {
                user.sessionid = null;
                user.save().then(function(){
                    session.destroy(function(error){
                        if(!error){
                            callback(false);
                        }
                    });
                });
            }
        } else {
            session.destroy(function(error){
                if(!error){
                    callback(false);
                }
            });
        }
    });
}

exports.index = function(request, response, next){
    "use strict";

    var session = request.session;
    if(session.username){
        console.log("Before");
        checksession(request, function(result){
            console.log(result);
            console.log("After");
            if(result){
                response.redirect("/dashboard");
            } else {
                response.render('login');
            }
        });
    } else {
        response.render('login');
    }
}

exports.login = function(request, response, next){

    console.log(request.body);
    console.log(request.session.id);
    console.log(request.sessionID);

    // uncomment next line to initialize the database
    //DB.init();

    DB.User.findOne({where: {username: request.body.username}}).then(function(user){
        //TODO No matter capitals, remove spaces
        if(user){
            //we found the user in the database
            console.log("User found " + user.username);
            if(user.password === request.body.password){
                console.log("Password match, go ahead");
                console.log(request.session);
                var session = request.session;

                session.username = user.username;
                session.roleid = user.roleid;
                user.sessionid = session.id;
                user.save().then(function(){
                    console.log("User saved");
                    response.redirect("/dashboard");
                });
            } else {
                console.log("Unknown user");
                response.render('login', {error: "Wrong credentials"});
            }
        } else {
            //do something else with the user. Redirect to some other page or ...
            console.log("Unknown user");
            response.render('login', {error: "Wrong credentials"});
        }
    });
};

exports.dashboard = function(request, response){
    "use strict";

    var session = request.session;
    console.log(session);

    if(session.username){
        checksession(request, function(result){
            if(result){
                response.render('dashboard', {'role': session.roleid});
            } else {
                response.redirect("/");
            }
        });
    } else {
        response.redirect("/");
    }
};

exports.admin_info = function(request, response){
    "use strict";

    var session = request.session;
    console.log(session);

    if(session.username){
        checksession(request, function(result){
            if(result){
                if(session.roleid == "ADM"){
                    response.render('admin_info');
                } else {
                    response.redirect("/dashboard");
                }
            } else {
                response.redirect("/");
            }
        });
    } else {
        response.redirect("/");
    }
};

exports.admin_supervisor_info = function(request, response){
    "use strict";

    var session = request.session;
    console.log(session);

    if(session.username){
        checksession(request, function(result){
            if(result){
                if(['ADM', 'SUP'].indexOf(session.roleid)>=0){
                    response.render('admin_supervisor_info');
                } else {
                    response.redirect("/dashboard");
                }
            } else {
                response.redirect("/");
            }
        });
    } else {
        response.redirect("/");
    }
};

exports.logout = function(request, response){
    "use strict";

    var session = request.session;
    console.log(session);

    DB.User.findOne({where: {username: session.username}}).then(function(user){
        if(user){
            user.sessionid = null;
            user.save().then(function(){ });
        }

        session.destroy(function(error){ });

        response.redirect("/");
    });
};
