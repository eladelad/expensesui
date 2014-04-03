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
app.use(express.static(path.join(__dirname, 'ui')));

app.get('/', function( req, res) {
	res.render('index');
});
//connect to mysql database
    var connection = mysql.createPool({
	host : 'localhost',
	port : '3307',
	user : 'expenses',
	password : 'expenses',
	database : 'expenses'
});



//------------GET DATA ------------------

//Get Categories
app.get('/getcats', function (req, res) {
	connection.query('SELECT c.*, p.path FROM categories c JOIN pictures p ON c.pic=p.id', function(err, docs) {
	res.end(JSON.stringify({cats: docs}));
	});
});

// Get Sub Categories, if parameter cat is exists and is a number - select by category
app.get('/getsubcats', function (req, res) {
	if (isNaN(req.query.cat)) { var selectquery = 'SELECT s.*, p.path FROM subcategories s JOIN pictures p ON s.pic=p.id'; } else { var selectquery = 'SELECT s.*, p.path FROM subcategories s JOIN pictures p ON s.pic=p.id where category='+req.query.cat; }
	connection.query(selectquery, function(err, docs) {
	res.end(JSON.stringify({subcats: docs}));
	});
});

//Get Payment Types
app.get('/getpayments', function (req, res) {
	connection.query('select * from paymenttypes', function(err, docs) {
	res.end(JSON.stringify({paymenttype: docs}));
    });
});

//Get Accounts
app.get('/getaccounts', function (req, res) {
	connection.query('select * from accounts', function(err, docs) {
	res.end(JSON.stringify({accounts: docs}));
    });
});

//Get All Categories and Sub Categories
app.get('/getallcats', function (req, res) {
	connection.query('select * from categories', function(err, docs) {
	res.write(JSON.stringify({cats: docs}));
	});
	connection.query('select * from subcategories', function(err, docs) {
	res.end(JSON.stringify({subcats: docs}));
	});
});

// Get transactions by date
app.get('/gettrans',function (req, res) {
	//Checking if getting from and to date, if so - regexing
	if ((req.query.fromdate) && (req.query.todate)){
		if (req.query.fromdate.match(/^\d{4}\-\d\d\-\d\d$/) && req.query.todate.match(/^\d{4}\-\d\d\-\d\d$/)) {
			var fromdate=req.query.fromdate,
			todate=req.query.todate;
			var selectquery = 'SELECT t.id, t.comment, DATE_FORMAT(t.date, \'%d-%m-%y\') \'Date\', c.name Category, pic.path,s.name subCategory,t.amount Amount,a.name Account, p.name paymentType FROM transactions t JOIN categories c ON t.category=c.id JOIN subcategories s ON t.subcategory=s.id JOIN accounts a ON t.account=a.id JOIN paymenttypes p  ON t.paymenttype=p.id  JOIN pictures pic ON c.pic=pic.id WHERE DATE BETWEEN \'' + fromdate + '\' AND \'' + todate + '\'';
		}
	}
	//Checking if getting mm and yyyy, if so - regexing (only if no select query was created before
	if ((!(selectquery)) && (req.query.mm) && (req.query.yyyy)){
		if (req.query.mm.match(/^0[1-9]$|^11$|^12$/) && req.query.yyyy.match(/^\d\d\d\d$/)) {
			var mm=req.query.mm,
			yyyy=req.query.yyyy;
			var selectquery = 'SELECT t.id, t.comment,DATE_FORMAT(t.date, \'%d-%m-%y\') \'Date\', c.name Category, pic.path,s.name subCategory,t.amount Amount,a.name Account, p.name paymentType FROM transactions t JOIN categories c ON t.category=c.id JOIN subcategories s ON t.subcategory=s.id JOIN accounts a ON t.account=a.id JOIN paymenttypes p  ON t.paymenttype=p.id JOIN pictures pic ON c.pic=pic.id WHERE MONTH(date) = ' + mm +' AND YEAR(date) = '+ yyyy;
		}
	}
	//if still no query - querying default of current month
	if (!(selectquery)){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		//if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
		selectquery = 'SELECT t.id, t.comment, DATE_FORMAT(t.date, \'%d-%m-%y\') \'Date\', c.name Category, pic.path, s.name subCategory,t.amount Amount,a.name Account, p.name paymentType FROM transactions t JOIN categories c ON t.category=c.id JOIN subcategories s ON t.subcategory=s.id JOIN accounts a ON t.account=a.id JOIN paymenttypes p  ON t.paymenttype=p.id JOIN pictures pic ON c.pic=pic.id WHERE MONTH(date) = ' + mm +' AND YEAR(date) = '+ yyyy;
	}
	connection.query(selectquery, function(err, docs) {
	res.end(JSON.stringify({trans :docs}));
	});
});

//---------------- POST DATA ----------------

app.post("/newsubcat", function (req, res) {
	var subcat=req.body.subcat;
	connection.query('INSERT INTO subcategories (name) VALUES (?);', [subcat], function(err, docs) {
	if (err) res.json(err);

	res.redirect('newsubcat');
	});
});

//Add Transaction
app.post("/addtrans", function (req, res) {
	var obj = JSON.parse( req.body.mydata );
	connection.query('INSERT INTO transactions (category, subcategory, amount, account, paymenttype, date, comment) VALUES (?, ?, ?, ?, ?, ? , ?);', [obj.category, obj.subcategory, obj.amount, obj.account, obj.paymenttype, obj.date, obj.comment], function(err, ress) {
	if (err) res.json(err);
	res.end(ress.insertId.toString());
	});
});

// --------------------- DELETE DATA ------------
app.post("/deletetrans", function (req, res) {
        if (req.query.transid % 1 === 0){
            connection.query('DELETE FROM transactions where id = ?', [req.query.transid], function(err,ress){
               if (err) res.json(err);
	            res.end("0");
            })
        } else { res.end("1")}
    }
)



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});