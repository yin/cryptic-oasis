var express = require('express');
var bodyparser = require('body-parser');
var orm = require('./modules/orm');
var rest = require('./modules/rest');
var initializer = require('./modules/initializer');

var sequelize = orm(process.env.DATABASE_URL);
var Transaction = sequelize.import(__dirname + '/models/transaction');
initializer.models(sequelize);
var transaction_rest = rest(sequelize, Transaction, {
	filterProcessor: function(filters) {
		if (_.isEmpty(filters)) {
			return 'unscheduled';
		} else if(_.contains(filters, 'all')) {
			return null;
		} else {
			return filters;
		}
	}
});

var app = express();
var web = express.Router();
var rest = express.Router();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

web.get('/', function(request, response) {
  response.render('pages/index');
});


rest.get('/hello', function(request, response) {
  response.json({ message: "Hello world!" });
});

rest.use('/transactions', transaction_rest);

app.use('/', web);
app.use('/api', rest);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
