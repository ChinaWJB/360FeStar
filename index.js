var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('index', { title: '360前端星计划' });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
