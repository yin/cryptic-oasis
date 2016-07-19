var express = require('express');
var bodyparser = require('body-parser')
var orm = require('./modules/orm')
var income_model = require('./modules/models/income');
var rest = require('./modules/rest')

console.log(orm, income_model, process.env.DATABASE_URL);

var app = express();
var sequelize = orm(process.env.DATABASE_URL || "");
var income = income_model(sequlize);

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

rest.use('/income', rest.sequelize(orm, models.Income));

app.use('/', web);
app.use('/api', rest);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


