//module dependencies
var express = require('express')
  , http = require('http')
  , mysql = require('mysql')
  , path = require('path');
var app = express();
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res) {
	res.render('index');
});
//connect to mysql database


//Get Categories
app.get('/getcats', function (req, res) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    docs = '{"cats":[{"id":3,"name":"Home/Rent","pic":1},{"id":5,"name":"Utilities","pic":1},{"id":6,"name":"Food/Groceries","pic":1},{"id":7,"name":"Departmental","pic":1},{"id":8,"name":"Entertainment","pic":1},{"id":9,"name":"Car/Auto","pic":1},{"id":10,"name":"Insurance/Medical","pic":1},{"id":11,"name":"Misc/One-time","pic":1},{"id":12,"name":"Fun","pic":1}]}';
	res.end(docs);
});

// Get Sub Categories, if parameter cat is exists and is a number - select by category
app.get('/getsubcats', function (req, res) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    docs = '{"subcats":[{"id":1250,"name":"Rent","pic":1,"category":3},{"id":1251,"name":"Association fee","pic":1,"category":3},{"id":1252,"name":"CellPhone","pic":1,"category":5},{"id":1253,"name":"Cable/Dish","pic":1,"category":5},{"id":1254,"name":"Internet","pic":1,"category":5},{"id":1255,"name":"Gas/Heating","pic":1,"category":5},{"id":1256,"name":"Electricity","pic":1,"category":5},{"id":1257,"name":"ארנונה","pic":1,"category":5},{"id":1258,"name":"Garbage","pic":1,"category":5},{"id":1259,"name":"Water","pic":1,"category":5},{"id":1260,"name":"Restaurant/Fast food","pic":1,"category":6},{"id":1261,"name":"Groceries","pic":1,"category":6},{"id":1262,"name":"פאב","pic":1,"category":6},{"id":1263,"name":"Good Look","pic":1,"category":7},{"id":1264,"name":"Clothing","pic":1,"category":7},{"id":1265,"name":"סופרפארם","pic":1,"category":7},{"id":1266,"name":"Personal items","pic":1,"category":7},{"id":1267,"name":"Books/Magazines","pic":1,"category":7},{"id":1268,"name":"דברים לבית","pic":1,"category":7},{"id":1269,"name":"Movies","pic":1,"category":8},{"id":1270,"name":"טכנולוגיה","pic":1,"category":8},{"id":1271,"name":"Music","pic":1,"category":8},{"id":1272,"name":"דגים","pic":1,"category":8},{"id":1273,"name":"הופעות","pic":1,"category":8},{"id":1274,"name":"נסיעות אוטובוס","pic":1,"category":9},{"id":1275,"name":"תחזוקה","pic":1,"category":9},{"id":1276,"name":"Gasoline","pic":1,"category":9},{"id":1277,"name":"חניה","pic":1,"category":9},{"id":1278,"name":"נסיעות","pic":1,"category":9},{"id":1279,"name":"דלק טוסטוס","pic":1,"category":9},{"id":1280,"name":"דלק לאוטו","pic":1,"category":9},{"id":1281,"name":"Auto Loan","pic":1,"category":9},{"id":1282,"name":"תחזוקה אוטו","pic":1,"category":9},{"id":1283,"name":"Insurance - אופנוע","pic":1,"category":10},{"id":1284,"name":"Insurance - Medical","pic":1,"category":10},{"id":1285,"name":"Medical Expenses/Co-pay","pic":1,"category":10},{"id":1286,"name":"ביטוח לאוטו","pic":1,"category":10},{"id":1287,"name":"Hotel/Lodging","pic":1,"category":11},{"id":1288,"name":"Sex","pic":1,"category":11},{"id":1289,"name":"Gifts/Charity","pic":1,"category":11},{"id":1290,"name":"העשרה","pic":1,"category":11},{"id":1291,"name":"מעבר דירה","pic":1,"category":11},{"id":1292,"name":"Air tickets","pic":1,"category":11},{"id":1293,"name":"לימודים והעשרה","pic":1,"category":11},{"id":1294,"name":"טיולים","pic":1,"category":12},{"id":1295,"name":"Sport","pic":1,"category":12},{"id":1296,"name":"מתנות","pic":1,"category":12},{"id":1297,"name":"דברי ציור","pic":1,"category":12},{"id":1298,"name":"בישול ואפיה","pic":1,"category":12},{"id":1299,"name":"אלכוהול","pic":1,"category":12},{"id":1300,"name":"טיול לברלין","pic":1,"category":12},{"id":1301,"name":"תפירה","pic":1,"category":12},{"id":1302,"name":"אירוח","pic":1,"category":12},{"id":1303,"name":"חו״ל","pic":1,"category":12}]}';
	res.end(docs);
});

//Get Payment Types
app.get('/getpayments', function (req, res) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	docs = '{"paymenttype":[{"id":1,"name":"AMEX","pic":1,"account":2},{"id":2,"name":"VISA","pic":1,"account":1},{"id":3,"name":"Cash","pic":1,"account":1},{"id":4,"name":"Cash","pic":1,"account":2}]}';
	res.end(docs);
});

//Get Accounts
app.get('/getaccounts', function (req, res) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	docs = '{"accounts":[{"id":1,"name":"elad","balance":0},{"id":2,"name":"elad2","balance":0}]}';
	res.end(docs);
});

app.post("/addtrans", function (req, res) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET','POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	var obj = JSON.parse( req.body.mydata );
	console.log(obj.date);
	connection.query('INSERT INTO transactions (category, subcategory, amount, account, paymenttype, date, comment) VALUES (?, ?, ?, ?, ?, ? , ?);', [obj.category, obj.subcategory, obj.amount, obj.account, obj.paymenttype, obj.date, obj.comment], function(err, docs) {
	if (err) res.json(err);
	
	});
	
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});