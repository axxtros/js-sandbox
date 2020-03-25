//minden itt van egy helyen
//https://expressjs.com/en/guide/routing.html
//https://expressjs.com/


//node.js demo

//https://code.visualstudio.com/docs/nodejs/nodejs-tutorial
//https://www.guru99.com/node-js-express.html

//angularjs felület futtatás (a legalsó bejegyzés alapján (*) kell)
//https://stackoverflow.com/questions/56181443/how-can-i-run-angular-app-on-node-server

//cors engedélyezése
//https://expressjs.com/en/resources/middleware/cors.html

var express = require('express'),
  compression = require('compression'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),  
  path = require('path'),
  fs = require('fs'),
  cors = require('cors');       //ez kell a CORS engedélyhez, hogy post-olhass a szerver felé, és hogy a böngészők cors policy-ja ne legyen probléma

var app = express();
app.use(cors());

app.use(compression({threshold: 1}));
app.use(logger('common'));
app.use(logger(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var second = require('./second');

/*
const root = path.join(__dirname, 'dist', 'angular-demo');  //angularjs
app.get('*', function(req, res) {
  fs.stat(root + req.path, function(err){
    if(err){
        res.sendFile("index.html", { root });
    }else{
        res.sendFile(req.path, { root });
    }
  })
});
*/

app.get('/', function(req, res)
{
    console.log('console...');
    second.func1();  
    res.send('Welcome! Node js server is running...');
});

////így kell használni a modulokat
//https://expressjs.com/en/guide/routing.html
var third = require('./third');
app.use('/third', third);

var server = app.listen(3000, function() {
  
});