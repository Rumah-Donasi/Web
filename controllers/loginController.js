exports.getView = (req, res) => {
  res.send('Register page');
};

const { pool, checkDB } = require('../database/db.js');
// Check database connection
checkDB();

const dberror = () => {
  console.error('DB query error:', error);
  res.status(500).send('Internal server error');
};
//query pgsql
const aquery = 'select * from admins where username = $1 and passwd = $2 limit 1'

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      aquery, [username, password]
    );
    if (result.rows.length > 0) {
      req.session.role = 'admin';
      req.session.username = username;
      res.redirect('/admin');
    } else {
      res.redirect('/private/adminlogin.html');
    }
  } catch (error) {
    console.error('DB query error:', error);
    res.status(500).send('Internal server error');
  }
}

