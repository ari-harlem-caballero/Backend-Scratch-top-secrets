const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newSecret = await Secret.insert(req.body);

      res.send(newSecret);
    } catch (err) {
      next(err);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const secretArr = await Secret.getAllSecrets();

      res.send(secretArr);
    } catch(err) {
      next(err);
    }
  });
