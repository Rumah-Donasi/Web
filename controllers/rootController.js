function rootRedirect(req, res) {
  if (req.session.role === 'admin') {
    res.redirect('/admin');
  }
  else if (req.session.role === 'user') {
    res.redirect('/user');
  }
  else if (req.session.role === 'lembaga') {
    res.redirect('/lembaga');
  }
  else {
    res.redirect('/login');
  }
}

module.exports = { rootRedirect };