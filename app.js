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
    cekLogin,
    redirectIfLogin
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
app.use('/akun', redirectIfLogin, require('./routes/akunRoute'));
app.use('/lembaga', redirectIfLogin, require('./routes/lembagaRoute'));
app.use('/admin', authAdmin, require('./routes/adminRoute'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
