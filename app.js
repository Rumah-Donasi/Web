var express = require('express');
var app = express();
const session = require('express-session');
var path = require('path');

const views = path.join(__dirname, 'public', 'views', 'pages')+ '\\';
// set the view engine to ejs

// Set folder views
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

const pilihanIssue = require('./middleware/showIssue');
const randomIssue = require('./middleware/showIssue');
const getIssue = require('./middleware/showIssue');

app.get('/', pilihanIssue, (req, res) => {
  res.render('pages/index', {
    user: {
      name: 'Egit',
      image: null
    },
    issues: req.issues,
    random: req.random
  });
});

app.get('/view', getIssue, (req, res) => {
  res.render('pages/viewIssue', {
    user: {
      name: 'Egit',
      image: null
    },
    issue: req.issue,
    donatur: req.donatur
  });
});

app.use('/cari', require('./routes/searchRoute'));

app.listen(8080);
console.log('Server is listening on port 8080');