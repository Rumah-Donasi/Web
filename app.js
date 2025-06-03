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

// index page
app.get('/', function(req, res) {
  res.render(views + 'index', {
    user : null
  });
});

app.get('/login', function(req, res) {
  res.render(views + 'login');
});

app.get('/:id', function(req, res) {
  res.render(views + 'index', {
    user: {
      name: 'Egit',
      image : null
    }
  });
});

app.get('/a/:where', (req, res) => {
  res.render('pages/account', { 
    user: { 
      name: 'Egit',
      image : null
    } 
  });
});


app.listen(8080);
console.log('Server is listening on port 8080');