var express = require('express');
var expressHandlebars = require('handlebars');
var bodyParser = require('body-parser');

var Sequelize = require('sequelize');

var connection = new Sequelize('test_validation_db', 'root', {
  dialect: 'mysql',
  port: 3306,
  host: 'localhost'
});

var PORT = 1738;

var app = express();

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));

var Note = connection.define('note', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len:{
        args:[1,10],
        msg: 'please enter a title that is not too long and at least one character',
      }
    }
  },
  body: {
    type: Sequelize.TEXT,
    validate: {
      check: function(bodyVal){
        if (bodyVal == "watwatwat") {
          throw new Error('Text must not be watwatwat')
        }
      }
    }
  }
});

app.get('/', function(req, res){
  Note.findAll({}).then(function(results){
    res.render('home', {results});
  })
});

app.post('/entry', function(req, res){
  var myTitle = req.body.title;
  var myText = req.body.text;

  Note.create({
    title: myTitle,
    body: myTet
  }).then(function({
    res.redirect('/success')
  }).catch(function(err){
    console.log(err);
    res.redirect('/fail');
  })
});

app.get('/success', function(req, res){
  res.send('Sucess Page!');
});

app.get('/fail', function(req, res){
  res.send("failed to add entry.");
});

connecton.sync().then(function(){
  app.listen(PORT, function({
    console.log('listening on port 1738');
  })
});
