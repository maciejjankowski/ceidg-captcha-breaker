/**
 * Created by mj on 13.01.14.

 TODO:

 1. dodac pobieranie na podstawie Session Id ???
 2. zamienic request na curl ???
 3. przetestować zapis firm do bazy
 4. dodać zapisywanie kolejki zapytań do bazy
 */
var express = require('express');
//var Base64 = require('./base64.js');
var nconf = require('nconf');

var L = {
log : console.log,
error : console.error,
warn : console.warn,
ping : function(){}
}

nconf.env().file({file: 'settings.json'});

var secrets = nconf.get('secrets');

var fs = require('fs');

var guess = require('./guess.js');

var url = require('url');
var app = express();

// app.use(express.cookieParser());
// app.use(express.session({secret: '1234567qwe890QWERTY'}));

express.logger.format('mydate', function() {
  return new Date((new Date().getTime()) + 1000 * 60 * 60).toJSON().replace("T", " ").replace("Z","");
});

app.use(express.logger(':mydate :url :remote-addr - :response-time ms'));
app.use(express.bodyParser() );
app.use(express.urlencoded() );
app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Accept, Origin, X-Requested-With, Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.end("OK");
  }
  else {
    next();
  }
});

var curling = function(req, res){
  if (typeof req.params.uid == "undefined")
    req.params.uid = 'demo';

  guess.breakIt(req.params.uid , req.params.cid,  req.params.sid, req.params.apiKey, function(ret){
    console.info(ret);
    res.set('Content-Type', 'text/plain; cId:'+req.params.id);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers',"Accept, Origin, X-Requested-With, Content-Type, Authorization");
    var d = nconf.get("delay");
    if (d && d > 1 || req.params.uid == 'demo')
      setTimeout(function(){
        res.end(ret);
      }, d);
    else
      res.end(ret);
  });
};

var curlingDemo = function(req, res){

  guess.breakIt('demo', req.params.cid, req.params.sid, req.params.apiKey ,function(ret){
    res.set('Content-Type', 'text/plain; cId:' + req.params.id);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers',"Accept, Origin, X-Requested-With, Content-Type, Authorization");
    res.end(ret);
  });
};

function isAuthorized(){
  return 1;
}

app.use(app.router);

var server = app.listen(process.env.port || nconf.get("port") || "3210");
var io = require('socket.io').listen(server)
    .set('log level', 0);

var status = function(req,res){
  res.set('Content-Type', 'text/plain');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
  res.end('OK');
};


var notAuthorized = function(sid){

    return (typeof secrets[sid] == 'undefined' || sid == 'demo')
};



app.get('/solve/:cid/:sid', curlingDemo);
app.get('/solve/:cid/:sid/:apiKey', curlingDemo);
app.get('/v2/solve/:uid/:cid/:sid/:apiKey', curling);








































