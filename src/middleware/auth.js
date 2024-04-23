exports.home = async (req, res, next) => {
  if (req.session.user_data)
  {
      res.redirect('/report');
  }
  else res.redirect('/login');
};

exports.out = async (req, res, next) => {
  if (req.session.user_data)
  {
      res.redirect('/report');
  }
  else next();
};


exports.auth = async (req, res, next) => {
  if (req.session.user_data) {
    next();
  }
  else {
    res.redirect('/login');
  }
}
