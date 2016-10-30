var DB = require('./database');

var checkexpiration = function(request, callback){
    //1 minute, time in miliseconds
    //change first value to modify time in seconds
    var maxSessionTime = 20 * 1000;

    var session = request.session;
    var difference = Date.now() - session.time;
    console.log("Time difference - " + difference);
    if(difference < maxSessionTime){
        //the session hasn't expired, less than a minute
        session.time = Date.now();
        callback(false);
    } else {
        //the session expired. more than a minute
        //the user has been inactive for more than a minute
        callback(true);
    }
};

var checksession = function(request, callback){
    //checks for the user in session and if the sessionid matches the one in the
    //db. If everyting goes well, returns true, otherwise expires the session,
    //remove the sessionid from the db and return false
    var session = request.session;
    DB.User.findOne({where: {username: session.username}}).then(function(user){
        if(user){
            if(user.sessionid == session.id && user.roleid == session.roleid){
                //username in session founf in db. matches session id and roleid
                callback(true);
            } else {
                //username in session found in db but either doesn't match sessionid
                //or roleid
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
            //username is in session but it's not found in the db
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

    if(session.time){
        checkexpiration(request, function(result){
            if(result){
                response.redirect('/logout');
            } else {
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
        });
    } else {
        response.render('login');
    }
}

exports.login = function(request, response, next){

    console.log(request.body);
    console.log(request.session.id);
    console.log(request.sessionID);

    //uncomment next line to initialize the database
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

                user.sessionid = session.id;
                user.save().then(function(){
                    session.username = user.username;
                    session.roleid = user.roleid;
                    session.time = Date.now();
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

    if(session.time){
        checkexpiration(request, function(result){
            if(result){
                response.redirect('/logout');
            } else {
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

    if(session.time){
        checkexpiration(request, function(result){
            if(result){
                response.redirect('/logout');
            } else {
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

    if(session.time){
        checkexpiration(request, function(result){
            if(result){
                response.redirect('/logout');
            } else {
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
