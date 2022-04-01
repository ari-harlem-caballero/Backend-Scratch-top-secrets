const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const newSecret = await Secret.insert(req.body);

      res.send(newSecret);
    } catch (err) {
      next(err);
    }
  });
