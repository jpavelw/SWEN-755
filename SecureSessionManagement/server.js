"use strict"

var express = require('express'),
    bodyParser = require('body-parser'),
    assert = require('assert'),
    consolidate = require('consolidate'),
    paths = require('./paths'),
    app = express();

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function errorHandler(error, request, response, next){
    console.error(error.message);
    console.error(error.stack);
    response.status(500);
    response.render('error_template', {error: error.message});
}

app.get('/', function(request, response, next){
    response.render('login');
});

app.use(errorHandler);

var server = app.listen(7760, function(){
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});
