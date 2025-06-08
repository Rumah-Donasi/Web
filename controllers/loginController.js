exports.getView = (req, res) => {
  res.send('Register page');
};

const { pool, checkDB } = require('../database/db.js');
// Check database connection
checkDB();

const dberror = () =>{
  console.error('DB query error:', error);
  res.status(500).send('Internal server error');
};
//query pgsql
const uquery='SELECT * FROM users WHERE username = ? AND password = ?'
const lquery='SELECT * FROM lembaga WHERE username = ? AND password = ?'

exports.postLogin = (req, res) => {
  const { username, password, code } = req.body;
  //user login
  if (req.session.user) {
    res.redirect('/dashboard');
  }
  else if (req.session.lembaga) {
    res.redirect('/lembaga/dashboard');
  }

  if (code === 1) {
    console.log('Received code 1');
    // Check user credentials in the database
    pool.query(uquery, [username, password], (error, results) => {
      if (error) {//handle error
        dberror;
      }
      else if (results.length > 0) {//if correct redirect to dashboard
        console.log('Login successful for user:', username);
        req.session.user = results[0];
        res.redirect('/dashboard');
        res.send('welcome ', username);
      }
      else {//handle invalid input
        res.status(401).send('Invalid username or password');
      }
    });
  }
  //lembaga login
  else if (code === 2) {

    console.log('Received code 2');
    // Check user credentials in the database
    pool.query(lquery, [username, password], (error, results) => {
      //change this i forgot
      if (error) {//handle error
        dberror;
      } else if (results.length > 0) {//if correct redirect to dashboard
        console.log('Login successful for lembaga:', username);
        req.session.user = results[0];
        res.redirect('/dashboard');
        res.send('welcome ', username);
      } else {//handle invalid input
        res.status(401).send('Invalid username or password');
      }
    });
  }
  else {
    res.status(400)
    console.log('Invalid code');

  }


};