const express = require('express');
const htp = require('http'),
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport')
const mongoose = require('mongoose')
const errorhandler = require('errorhandler')
const cors = require('cors')
const session = require('express-session')

const app = express();

app.use(cors());

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessopm({ secret: 'conduit', cookie: {maxAge: 60000}, resave:false, saveUninitialized: false }))

//database setup
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my-chibi', { useNewUrlParser: true });

require('./model/User');
require('./models/Resource');
require('./models/Comment');
require('./config/passport');

app.use(require('./routes'));

// view engine setup
const hbs = require('express-handlebars');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'))

app.use(session({ secret: 'conduit', cookie: {mazAge: 6000}, resave: false, saveUninitialized: false }))


// localhost:3100
app.listen(3100, () => {
    console.log('App listening on port 3100!')
})
