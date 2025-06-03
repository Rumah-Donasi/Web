var express = require('express');
var app = express();
var path = require('path');

const views = path.join(__dirname, 'public', 'views', 'pages')+ '\\';
// set the view engine to ejs

// Set folder views
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', require('./routes/firstRoute'));
app.use('/cari', require('./routes/searchRoute'));
app.use('/akun', require('./routes/akunRoute'));
app.use('/isu', require('./routes/galangDanaRoute'));
app.use('/lembaga', require('./routes/lembagaRoute'));

app.listen(8080);
console.log('Server is listening on port 8080');