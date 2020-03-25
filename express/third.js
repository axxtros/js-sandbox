//így kell használni a modulokat
//https://expressjs.com/en/guide/routing.html

var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
});

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
});

//angularJS teszt (postman-el is jó)
//postman beállítások: [{"key":"Accept","value":"application/xml","description":""},{"key":"Accept-Encoding","value":"UTF-8","description":""},{"key":"Content-Type","value":"application/x-www-form-urlencoded","description":""}]
router.post('/angularPostDemoUrl', function (req, res) {    
  console.log('username: ' + req.body.username);
  //res.status(200).json("válasz...");                //sima szöveges válasz 200-as státusszal
  //res.status(200).json(req.body.username);          //json válasz
  //res.end(JSON.stringify('Thank you!')+'\r\n');     //szima szöveg válasz
  //res.end('sima szöveges válasz...');                       //sima szöveg válasz
  responseDemo(res);
});

//komplett json válasz
//https://stackoverflow.com/questions/5892569/responding-with-a-json-object-in-node-js-converting-object-array-to-json-string
//, "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type"
function responseDemo(response) {
  //application/x-www-form-urlencoded
  response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type"});
  var otherArray = ["name1", "name2"];
  var otherObject = { name1: "item1val", name2: "item2val" };
  var json = JSON.stringify({ 
    anObject: otherObject, 
    anArray: otherArray, 
    another: "item"
  });
  response.end(json);
}

//request object --------------------------------------------------------------

//http://localhost:3000/third/requestobj/query?nev=Tibor&szuldatum=1980
router.get('/requestobj/query', function (req, res) {
  console.log('req.query: ' + req.query);
  res.end(JSON.stringify(req.query)+'\r\n');
});

//http://localhost:3000/third/requestobj/params/valamilyen_ertek_1/valamilyen_ertek_2
router.get('/requestobj/params/:param1/:param2', function (req, res) {
  res.end(JSON.stringify(req.params)+'\r\n');
  console.log(req.params);
  res.end();
});

module.exports = router;