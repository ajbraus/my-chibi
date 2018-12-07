const express = require('express');
const http = require('http');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler')
const cors = require('cors')
const session = require('express-session')
const mongoose = require('mongoose')
const app = express();
const apiroutes = require('./routes');


app.use(cors());

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({ secret: 'conduit', cookie: {maxAge: 60000}, resave:false, saveUninitialized: false }))


require('./models/User');
require('./models/resource');
require('./models/comment');
require('./config/passport');
//database setup
//Got this error:
//(node:53366) DeprecationWarning: current URL string parser is ////deprecated, and will be removed in a future version. To use the //new parser, pass option { useNewUrlParser: true } to //MongoClient.connect.
mongoose.connect('mongodb://localhost:27017/my-chibi');


app.use('/', apiroutes);


app.use(methodOverride('_method'));
//app.use(express.static(__dirname + '/public'))

app.use(session({ secret: 'conduit', cookie: {mazAge: 6000}, resave: false, saveUninitialized: false }))


// view engine setup
const hbs = require('express-handlebars');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))


// localhost:3100
app.listen(3100, () => {
    console.log('App listening on port 3100!')
})
