const authAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    next();
  } else {
    res.redirect('/private/adminlogin.html');
  }
}

const authLembaga = (req, res, next) => {
  if (req.session && req.session.role === 'lembaga') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: unathorized access' });
  }
}

const authUser = (req, res, next) => {
  if (req.session && req.session.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: unathorized access' });
  }
}

module.exports = { authAdmin, authLembaga, authUser };