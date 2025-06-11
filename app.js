var express = require('express');
var app = express();
var path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const {
    cekLogin
} = require('./middleware/authUser');

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});
app.use(cekLogin);

app.use('/', require('./routes/firstRoute'));
app.use('/cari', require('./routes/searchRoute'));
app.use('/akun', require('./routes/akunRoute'));
app.use('/lembaga', require('./routes/lembagaRoute'));
app.use('/issue', require('./routes/issueRoute'));

app.listen(8080);
console.log('Server is listening on port 8080');