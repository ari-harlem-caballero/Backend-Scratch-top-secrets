const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    console.log('cooooookie!!!!', cookie);
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    err.message = 'Must be signed in to create a secret';
    err.status = 401;

    next(err);
  }
};
