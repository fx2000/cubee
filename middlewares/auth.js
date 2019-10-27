// Check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/stories');
  }
  next();
}

// Check if user is logged out
const notLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = { isLoggedIn, notLoggedIn };