const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//database setup
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my-chibi', { useNewUrlParser: true });


// view engine setup
const hbs = require('express-handlebars');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static('public'))


// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));


// localhost:3100
app.listen(3100, () => {
    console.log('App listening on port 3100!')
})

module.exports = app;
